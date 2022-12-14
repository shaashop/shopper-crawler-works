const sequelize = require('sequelize');

// load Dao
const FileDao = require('../../dao/file/file_dao');

// FileService
const FileService = {
  getFileList: async function (req, res, paramJson) {
    let result = { status: 'N' };
    const condJson = FileDao.getFileCond(paramJson);
    const fileList = await FileDao.getFileList(req, res, condJson);
    if (!fileList) return false;

    result['status'] = 'Y';
    result['fileList'] = fileList;
    return result;
  },
  getFileListPaging: async function (req, res, paramJson) {
    let result = { status: 'N' };
    let condJson = FileDao.getFileCond(paramJson);
    condJson['PAGE'] = paramJson.PAGE;
    const lineLimit = paramJson.boardLineLimit
      ? paramJson.boardLineLimit
      : res.locals.meta.BOARD_LINE_LIMIT;
    paramJson['lineLimit'] = lineLimit;
    const paging = await FileDao.getFileListPaging(
      req,
      res,
      condJson,
      paramJson,
    );
    if (!paging) return false;

    condJson['file'] = sequelize.literal('createDate DESC, updateDate DESC');
    condJson['offset'] = paging.offset * res.locals.meta.BOARD_LINE_LIMIT || 0; //시작 번호
    condJson['limit'] = req.query.size || res.locals.meta.BOARD_LINE_LIMIT; //출력 row 수

    const fileList = await FileDao.getFileList(req, res, condJson);
    if (!fileList) return false;

    result['status'] = 'Y';
    result['paging'] = paging;
    result['fileList'] = fileList;
    return result;
  },
  getFileListCnt: async function (req, res, paramJson) {
    let result = { status: 'N' };
    const condJson = FileDao.getFileCond(paramJson);
    const cnt = await FileDao.getFileListCnt(req, res, condJson);

    result['status'] = 'Y';
    result['cnt'] = cnt;
    return result;
  },
  getFile: async function (req, res, paramJson) {
    let result = { status: 'N' };
    let condJson = FileDao.getFileCond(paramJson);
    condJson.where['id'] = paramJson.fileId;
    const file = await FileDao.getFile(req, res, condJson);
    if (!file) return false;

    result['status'] = 'Y';
    result['file'] = file;
    return result;
  },
  insertFile: async function (req, res, paramJson) {
    let result = { status: 'N' };

    const queryJson = {
      targetType: paramJson.targetType,
      targetSubType: paramJson.targetSubType,
      targetId: paramJson.targetId,
      userId: paramJson.userId,
      fileUrl: paramJson.fileUrl,
      fileName: paramJson.fileName,
      fileType: paramJson.fileType,
      fileSize: paramJson.fileSize,
      createId: paramJson.createId,
    };
    const file = await FileDao.insertFile(req, res, queryJson);
    if (!file) return result;

    result['status'] = 'Y';
    result['file'] = file;
    return result;
  },
  updateFile: async function (req, res, queryJson, condJson) {
    let result = { status: 'N' };
    queryJson['updateDate'] = sequelize.literal('CURRENT_TIMESTAMP');
    const updateCnt = await FileDao.updateFile(req, res, queryJson, condJson);
    if (!updateCnt) return result;

    result['status'] = 'Y';
    return result;
  },
};

module.exports = FileService;
