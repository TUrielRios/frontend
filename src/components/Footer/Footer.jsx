import React from 'react';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import styles from './Footer.module.css';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          {/* Logo */}
          <img src={logo} className={styles.logo} alt="" />

        </div>
        
        {/* Social Media Icons */}
        <div className={styles.socialIcons}>
          <a href="#" className={styles.socialLink}>
            <Instagram size={20} />
          </a>
          <a href="#" className={styles.socialLink}>
            <Facebook size={20} />
          </a>
          <a href="#" className={styles.socialLink}>
            <Youtube size={20} />
          </a>
          <a href="#" className={styles.socialLink}>
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;