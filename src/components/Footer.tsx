import Fragment from '@astrojs/preact';

const Footer = () => {
  return (
    <footer className="py-12 bg-black text-white">
      <div className="pt-4 pb-3 mx-4 md:mx-auto flex place-content-between max-w-6xl">
        <a href="/plan-site">Plan du site</a>
        <a href="/mentions-legales">Mentions légales</a>
      </div>
    </footer>
  );
};

export default Footer;
