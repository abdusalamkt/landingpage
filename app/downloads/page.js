import DownloadItem from '../components/DownloadItem';
import './downloads.module.css'; 
import Header from '../components/Header';



const downloads = [
  {
    title: 'Free Brochure',
    thumbnail: '/Logo.png',
    link: 'https://www.gfiuae.com/gfiuae/wp-content/uploads/2023/11/Gibca-Company-Profile-Brochure_compressed.pdf',
    gated: false,
  },
  {
    title: 'Exclusive Case Study',
    thumbnail: '/Logo.png',
    link: 'https://www.gfiuae.com/gfiuae/wp-content/uploads/2023/11/Gibca-Company-Profile-Brochure_compressed.pdf',
    gated: true,
  },
  // Add more
];

const DownloadsPage = () => {
  return (<>
    <Header />
    <section className="downloads-grid">
      {downloads.map((item, index) => (
        <DownloadItem key={index} item={item} />
      ))}
    </section></>
  );
};

export default DownloadsPage;
