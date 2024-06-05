import ReactMarkdownWithHtml from 'react-markdown';

const MyComponent = (props) => {
  const markdownContent = props.text;
  return (
    <div>
      <ReactMarkdownWithHtml>{markdownContent}</ReactMarkdownWithHtml>
    </div>
  );
};

export default MyComponent;