/*
Navicat MySQL Data Transfer

Source Server         : 172.20.5.239
Source Server Version : 50547
Source Host           : 172.20.5.239:3306
Source Database       : scm_test

Target Server Type    : MYSQL
Target Server Version : 50547
File Encoding         : 65001

Date: 2018-06-25 18:20:11
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adminFlag` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'hisi', '12345678', 'zhangqi@skyworth.com', '0');
INSERT INTO `users` VALUES ('2', 'fanyanbo', '12345678', 'fanyanbo@skyworth.com', '0');
INSERT INTO `users` VALUES ('3', 'liujinpeng', 'srtsrt', 'liujinpeng@skyworth.com', '0');
INSERT INTO `users` VALUES ('4', 'hefengshuang', '12345678', 'hefengshuang@skyworth.com', '1');
INSERT INTO `users` VALUES ('5', 'sys1', '12345678', 'liyuping@skyworth.com', '0');
INSERT INTO `users` VALUES ('6', 'rtk', '12345678', 'liuzhanhong@skyworth.com', '0');
INSERT INTO `users` VALUES ('7', 'mst', '12345678', 'fengxuanye@skyworth.com', '0');
INSERT INTO `users` VALUES ('8', 'liyuping', '12345678', 'liyuping@skyworth.com', '1');
INSERT INTO `users` VALUES ('9', 'fengxuanye', '12345678', 'fengxuanye@skyworth.com', '0');
INSERT INTO `users` VALUES ('10', 'weisijia', '931217', 'weisijia@skyworth.com', '0');
INSERT INTO `users` VALUES ('11', 'liuyuqi', '12345678', 'liuyuqi@skyworth.com', '0');
INSERT INTO `users` VALUES ('12', 'lihongyong', '12345678', 'lihongyong@skyworth.com', '0');
INSERT INTO `users` VALUES ('13', 'yueshun', '12345678', 'yueshun@skyworth.com', '0');
INSERT INTO `users` VALUES ('14', 'zhouqiang', '12345678', 'zhouqiang@skyworth.com', '0');
INSERT INTO `users` VALUES ('15', 'hewenqiang', '12345678', 'hewenqiang@skyworth.com', '0');
INSERT INTO `users` VALUES ('16', 'huangjun', '12345678', 'huangjun04@skyworth.com', '0');
INSERT INTO `users` VALUES ('17', 'zhangqi', '12345678', 'zhangqi@skyworth.com', '0');
INSERT INTO `users` VALUES ('18', 'fukai', '13572468', 'fukai@skyworth.com', '0');
INSERT INTO `users` VALUES ('19', 'changmeixia', '12345678', 'changmeixia@skyworth.com', '0');
INSERT INTO `users` VALUES ('39', 'admin_test', '12345678', 'admin_test@skyworth.com', '1');
INSERT INTO `users` VALUES ('40', 'linxinwang', '12345678', 'linxinwang@skyworth.com', '1');
