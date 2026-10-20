export default function Message({ msg }) {
  if (!msg || !msg.text) return null;
  return <div className={'message' + (msg.error ? ' error' : '')}>{msg.text}</div>;
}
