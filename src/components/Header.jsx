export default function Header({ children, className }) {
  return (
    <header className={className}>
      <span className='header-title'>Shopping cart</span>
      {children}
    </header>
  );
}
