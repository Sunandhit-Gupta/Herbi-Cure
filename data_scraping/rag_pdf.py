import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
    text = text.replace("•", "  *")
    return Markdown(textwrap.indent(text, "> ", predicate=lambda _: True))


from dotenv import load_dotenv

load_dotenv(".env")

import os
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain.vectorstores import FAISS


files = []
for file in os.listdir("texts"):
    files.append("texts/" + file)
loaders = UnstructuredFileLoader(files)
data = loaders.load()
len(data)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

docs = text_splitter.split_documents(data)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

from langchain_google_genai import GoogleGenerativeAIEmbeddings

gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

for i in range(len(docs) // 100):
    db = FAISS.from_documents(
        docs[i * 100 : min((i + 1) * 100, len(docs))], gemini_embeddings
    )

    file_path = f"saved_embeddings/{i + 1}"
    db.save_local(file_path)
    print(f"Saved embeddings for batch {i + 1} to {file_path}")


base_path = "saved_embeddings"
all_dbs = []

for subfolder in sorted(os.listdir(base_path)):
    subfolder_path = os.path.join(base_path, subfolder)

    if os.path.isdir(subfolder_path):
        db = FAISS.load_local(
            folder_path=subfolder_path,
            embeddings=gemini_embeddings,
            allow_dangerous_deserialization=True,
        )
        all_dbs.append(db)
        print(f"Loaded embeddings from {subfolder_path}")


if all_dbs:
    target_db = all_dbs[0]

    # Merge all other databases into the target database
    for db in all_dbs[1:]:
        FAISS.merge_from(target_db, db)

    retriever = target_db.as_retriever(search_kwargs={"k": 3})
else:
    print("No databases loaded.")


from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest", temperature=0.3, top_p=0.85
)

from langchain.chains import RetrievalQAWithSourcesChain

chain = RetrievalQAWithSourcesChain.from_llm(llm=llm, retriever=retriever)

from langchain import PromptTemplate
from langchain.schema import StrOutputParser
from langchain.schema.prompt_template import format_document
from langchain.schema.runnable import RunnablePassthrough

llm_prompt_template = """You are an assistant for question-answering tasks with advanced analytical and reasoning capabilities.
Use the following context to answer the question.
If you don't know the answer, try to answer without context but mention that you are doing so without context.\n
Question: {question} \nContext: {context} \nAnswer:"""

llm_prompt = PromptTemplate.from_template(llm_prompt_template)

print(llm_prompt)

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | llm_prompt
    | llm
    | StrOutputParser()
)

# Invoke the chain with example questions
responses = [
    rag_chain.invoke("What are the 3 secondary supports of life?"),
    rag_chain.invoke("How to deal with heart disease"),
    rag_chain.invoke(
        "What asanas should I do if I have imbalance in strength of my left and right arm?"
    ),
    rag_chain.invoke("How can I make my tea better?"),
    rag_chain.invoke("Teach me in detail about dosas and how do I find mine?"),
    rag_chain.invoke("I have a Vatta-Pita imbalance. Help me"),
]

# Print the responses
for response in responses:
    print(response)
while True:
    question = input("Ask a question")
    if "stop" in question:
        break
    print(question + "\n\n")
    response = rag_chain.invoke(question)
    print(response + "\n\n")
