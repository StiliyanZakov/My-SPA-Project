const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Създаваме транспортер за изпращане на имейли
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Функция за изпращане на имейл за добре дошли
 * @param {string} to - имейл адрес на получателя
 * @param {string} name - име на получателя
 * @returns {Promise<boolean>} - успех или неуспех
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Добре дошли в нашия магазин!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Здравейте, ${name || 'уважаеми клиент'}!</h2>
          <p>Благодарим ви, че се регистрирахте в нашия онлайн магазин!</p>
          <p>Вече можете да разглеждате продуктите ни и да правите поръчки.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold;">Наслаждавайте се на следните предимства:</p>
            <ul style="padding-left: 20px;">
              <li>Проследяване на поръчките</li>
              <li>Запазване на любими продукти</li>
              <li>Специални отстъпки за регистрирани потребители</li>
              <li>И много други</li>
            </ul>
          </div>
          <p>Ако имате въпроси, не се колебайте да се свържете с нас.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #777;">С уважение,<br>Екипът на нашия магазин</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

/**
 * Функция за изпращане на имейл за потвърждение на поръчка
 * @param {string} to - имейл адрес на получателя
 * @param {string} name - име на получателя
 * @param {Object} order - информация за поръчката
 * @returns {Promise<boolean>} - успех или неуспех
 */
const sendOrderConfirmationEmail = async (to, name, order) => {
  try {
    const { orderId, items, total } = order;
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} лв.</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)} лв.</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `Потвърждение на поръчка #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Здравейте, ${name || 'уважаеми клиент'}!</h2>
          <p>Благодарим ви за вашата поръчка!</p>
          <p>Номер на поръчката: <strong>#${orderId}</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f7f7f7;">
                <th style="padding: 10px; text-align: left;">Продукт</th>
                <th style="padding: 10px; text-align: center;">Количество</th>
                <th style="padding: 10px; text-align: right;">Цена</th>
                <th style="padding: 10px; text-align: right;">Общо</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Обща сума:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${total.toFixed(2)} лв.</td>
              </tr>
            </tfoot>
          </table>
          
          <p>Ще получите известие, когато поръчката ви бъде изпратена.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #777;">С уважение,<br>Екипът на нашия магазин</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

/**
 * Функция за изпращане на имейл за възстановяване на парола
 * @param {string} to - имейл адрес на получателя
 * @param {string} resetLink - линк за възстановяване на паролата
 * @returns {Promise<boolean>} - успех или неуспех
 */
const sendPasswordResetEmail = async (to, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Възстановяване на парола',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Възстановяване на парола</h2>
          <p>Получихме заявка за възстановяване на вашата парола.</p>
          <p>Моля, кликнете върху бутона по-долу, за да зададете нова парола:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Задаване на нова парола</a>
          </div>
          
          <p>Ако не сте заявили възстановяване на парола, моля, игнорирайте този имейл.</p>
          <p>Линкът ще бъде валиден за 1 час.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #777;">С уважение,<br>Екипът на нашия магазин</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail
}; 