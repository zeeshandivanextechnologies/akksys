import '../landing/MobileDestinationPage.css';
import { FaQrcode } from 'react-icons/fa';
function Loader() {
  return (
    <>
    <div className="ld-screen">
        <div className="ld-loader">
          <div className="ld-spinner"><FaQrcode size={18} color="#00C8FF" /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {/* <FaQrcode size={18} color="#00C8FF" /> */}
            <span className="ld-brand-text">AKKSYS</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Loader