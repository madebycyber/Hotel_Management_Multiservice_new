// src/pages/Settings.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('settings')}</h1>

      {/* Card Ngôn ngữ */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <GlobeAltIcon className="w-6 h-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold dark:text-white">{t('language')}</h2>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => changeLanguage('vi')}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              i18n.language === 'vi' 
                ? 'bg-primary text-white border-primary' 
                : 'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-6" />
            Tiếng Việt
          </button>

          <button
            onClick={() => changeLanguage('en')}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              i18n.language === 'en' 
                ? 'bg-primary text-white border-primary' 
                : 'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-6" />
            English
          </button>
        </div>
      </div>

      {/* Card Giao diện (Demo thêm) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <MoonIcon className="w-6 h-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-semibold dark:text-white">{t('theme')}</h2>
        </div>
        <p className="text-gray-500 text-sm">Cài đặt giao diện Dark/Light mode đã được tích hợp trên thanh Header.</p>
      </div>
    </div>
  );
}