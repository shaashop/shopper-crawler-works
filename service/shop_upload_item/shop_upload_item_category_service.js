const ShopUploadItemCategoryService = {
  getCategoryDelimiter: function () {
    return "/:&,:/";
  },
  findGroupIdByMatching: function (groupList, itemShopCategory) {
    const headGroup = this.getHeadGroup(itemShopCategory);

    const matchedGroup = groupList.find((group) => group.title === headGroup);

    if (matchedGroup) {
      return matchedGroup.id;
    } else {
      return -1;
    }
  },
  getHeadGroup: function (itemShopCategory) {
    const categoryDelimiter = this.getCategoryDelimiter();
    const itemShopCategoryList = itemShopCategory.split(categoryDelimiter);
    const headGroup = itemShopCategoryList[0];
    return headGroup;
  },
};
module.exports = ShopUploadItemCategoryService;
