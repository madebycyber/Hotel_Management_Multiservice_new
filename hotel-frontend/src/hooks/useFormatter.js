// src/hooks/useFormatter.js
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useFormatter = () => {
  const { i18n } = useTranslation();

  // Mapping ngôn ngữ của i18n sang locale chuẩn của trình duyệt
  const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN';

  // 1. Format Ngày tháng
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit', // Bỏ comment nếu muốn hiện giờ
      // minute: '2-digit'
    }).format(date);
  }, [locale]);

  // 2. Format Tiền tệ
  const formatCurrency = useCallback((amount) => {
    if (amount === undefined || amount === null) return '0';
    
    // Nếu hệ thống chỉ dùng VND nhưng muốn đổi cách hiển thị (dấu chấm/phẩy)
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'VND', // Luôn là VND vì DB lưu tiền Việt
      minimumFractionDigits: 0 // Không hiện số lẻ thập phân cho VND
    }).format(amount);
  }, [locale]);

  // 3. Format Số thông thường (Ví dụ: số lượng khách)
  const formatNumber = useCallback((number) => {
    return new Intl.NumberFormat(locale).format(number);
  }, [locale]);

  return { formatDate, formatCurrency, formatNumber };
};