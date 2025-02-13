export default function Footer({ children, className }) {
  return (
    <footer className={className}>
      <h2 className='footer-title'>Shopping cart</h2>
      {children}
    </footer>
  );
}
