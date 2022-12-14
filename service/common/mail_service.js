const nodemailer = require('nodemailer');
const alram = require('../../config/local').customer.get('alram');
// load Service
const CommonService = require('../../service/common/common_service');

const MailService = {
  getTransport: function () {
    const transporter = nodemailer.createTransport({
      // service: 'gmail',
      host: 'smtp.gmail.com',
      // port: 465,
      // secure: true,
      auth: {
        user: 'shaashop.jaeho@gmail.com',
        pass: 'dlwo134679!!',
      },
    });
    return transporter;
},
  getMailOption: function (fromEmail, toEmail, subject, contents) {
    const mailOptions = {
      from: fromEmail, // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: toEmail, // 수신 메일 주소
      subject: subject, // 제목
      html: contents, // 내용
    };
    return mailOptions;
  },
  sendMail: async function (req, res, transporter, mailOption) {
    if (!alram) return false;
    const p = new Promise((resolve, reject) => {
      transporter.sendMail(mailOption, function (err, info) {
        if (err) {
          CommonService.handleError(err, req, res, null);
          reject({ status: 'N' });
        } else {
          console.log('Email sent: ' + info.response);
          transporter.close();
          resolve({ status: 'Y' });
        }
      });
    });
    return p;
  },
  sendMailAsync: async function (
    req,
    res,
    fromMail,
    toMail,
    subject,
    contents,
  ) {
    const transport = this.getTransport();
    const mailOption = this.getMailOption(fromMail, toMail, subject, contents);
    const sendMailResult = await this.sendMail(req, res, transport, mailOption);
    return sendMailResult.status == 'Y' ? true : false;
  },
  createHTMLContensJoin: function (siteURL) {
    let contents = '';
    contents += '<div id="readFrame">';
    contents += '<p>안녕하세요, 샤샵입니다.</p>';
    contents += '<p>아래 주소로 이동하여 샤샵 회원가입을 완료해주세요.</p>';
    contents += '<br/>';
    // contents += '<p><a href="'+siteURL+'" target="_blank" rel="noreferrer noopener">'+siteURL+'</a></p>';
    contents +=
      '<p><a href="' +
      siteURL +
      '" target="_blank" rel="noreferrer noopener">' +
      siteURL +
      '</a></p>';
    contents += '<br/>';
    contents += '<p>감사합니다.</p>';
    contents += '</div>';
    return contents;
  },
  createCargoChangeContent: function (params) {
    const { nation, name, orderProductName } = params;
    const siteUrl='https://shaa.shop/market/login/view';

    let contents='';
    contents += '<div id="readFrame">';
    contents += '<p>안녕하세요.</p>';
    contents += '<p>'+nation+'에서 '+name+'님께서 주문하신 상품의 주문이 완료되었습니다.</p><br>';
    contents += '<p>상품명: '+orderProductName+'</p><br>';
    contents +=
      '<p>송장번호 확인하기: <a href="' +
      siteUrl +
      '" target="_blank" rel="noreferrer noopener">' +
      siteUrl +
      '</a></p><br>';
    contents += '<p>주문문의가 있으실 경우 본 이메일로 답신 부탁드립니다.</p>';
    return contents;
  }

};

module.exports = MailService;
