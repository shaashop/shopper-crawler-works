const FCM_ADMIN = require('firebase-admin');

// load Service
const CommonService = require('../common/common_service');

const FcmService = {
  init: function (serviceAccount) {
    FCM_ADMIN.initializeApp({
      credential: FCM_ADMIN.credential.cert(serviceAccount),
    });
  },
  send: async function (req, res, paramJson) {
    return new Promise(async function (resolve, reject) {
      let result = { status: 'N' };
      const user = paramJson.user;
      const fcmType = paramJson.type;
      const fcmTitle = paramJson.title;
      const fcmContents = paramJson.contents;
      const fcmTargetToken = user.deviceToken;
      const fcmBadgeCnt = paramJson.badgeCnt.toString();
      const notification = JSON.stringify(paramJson.notification);

      if (CommonService.isEmpty(fcmTargetToken)) {
        CommonService.execError(
          req,
          res,
          500,
          'FcmService send Error : undefined-user-deviceToken ',
        );
        resolve(result);
      }

      const fcm_message = {
        notification: {
          title: fcmTitle,
          body: fcmContents,
          // sound : "default"
        },
        data: {
          fileno: '44',
          notice: 'yes',
          badge: fcmBadgeCnt,
          type: fcmType,
          notification: notification,
        },
        token: fcmTargetToken,
        android: {
          notification: {
            title: fcmTitle,
            body: fcmContents,
            notification_count: paramJson.badgeCnt,
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              title: fcmTitle,
              body: fcmContents,
              badge: paramJson.badgeCnt,
              sound: 'default',
            },
          },
        },
      };
      FCM_ADMIN.messaging()
        .send(fcm_message)
        .then(function (response) {
          console.log('Complete to send:' + response);
          result['status'] = 'Y';
          resolve(result);
        })
        .catch(function (error) {
          console.log('Fail to send:' + error);
          // TODO 에러사항을 저장하기
          resolve(result);
        });
    });
  },
};
module.exports = FcmService;
