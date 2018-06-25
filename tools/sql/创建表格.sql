
-- 创建所有表格 

/*
Navicat MySQL Data Transfer

Source Server         : 172.20.5.239
Source Server Version : 50547
Source Host           : 172.20.5.239:3306
Source Database       : scm_test

Target Server Type    : MYSQL
Target Server Version : 50547
File Encoding         : 65001

Date: 2018-06-20 14:30:49
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `chips`
-- ----------------------------
DROP TABLE IF EXISTS `chips`;
CREATE TABLE `chips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`name`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `configcategory`
-- ----------------------------
DROP TABLE IF EXISTS `configcategory`;
CREATE TABLE `configcategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_index` (`category`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `configs`
-- ----------------------------
DROP TABLE IF EXISTS `configs`;
CREATE TABLE `configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultValue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeStr` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `descText` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`engName`(64)),
  UNIQUE KEY `cnName_index` (`cnName`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `mkcategory`
-- ----------------------------
DROP TABLE IF EXISTS `mkcategory`;
CREATE TABLE `mkcategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_index` (`category`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `models`
-- ----------------------------
DROP TABLE IF EXISTS `models`;
CREATE TABLE `models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`name`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `modules`
-- ----------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gitPath` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `descText` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`engName`(64)),
  UNIQUE KEY `cnName_index` (`cnName`(64)),
  UNIQUE KEY `git_index` (`gitPath`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `props`
-- ----------------------------
DROP TABLE IF EXISTS `props`;
CREATE TABLE `props` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descText` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`engName`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `propscategory`
-- ----------------------------
DROP TABLE IF EXISTS `propscategory`;
CREATE TABLE `propscategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_index` (`category`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `sessions`
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `soc`
-- ----------------------------
DROP TABLE IF EXISTS `soc`;
CREATE TABLE `soc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`name`(32))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `syslog`
-- ----------------------------
DROP TABLE IF EXISTS `syslog`;
CREATE TABLE `syslog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `detail` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `targetProducts`
-- ----------------------------
DROP TABLE IF EXISTS `targetProducts`;
CREATE TABLE `targetProducts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_index` (`name`(128))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_configdata`
-- ----------------------------
DROP TABLE IF EXISTS `v60_configdata`;
CREATE TABLE `v60_configdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_configdata_temp`
-- ----------------------------
DROP TABLE IF EXISTS `v60_configdata_temp`;
CREATE TABLE `v60_configdata_temp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_mkdata`
-- ----------------------------
DROP TABLE IF EXISTS `v60_mkdata`;
CREATE TABLE `v60_mkdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `targetProduct` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `targetProduct_index` (`targetProduct`(128))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_modifyhistory`
-- ----------------------------
DROP TABLE IF EXISTS `v60_modifyhistory`;
CREATE TABLE `v60_modifyhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `reason` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` int(11) NOT NULL,
  `userName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modifyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_products`
-- ----------------------------
DROP TABLE IF EXISTS `v60_products`;
CREATE TABLE `v60_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `auditState` int(255) NOT NULL,
  `modifyState` int(255) NOT NULL,
  `androidVersion` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `memorySize` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `EMMC` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetProduct` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soc` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userName` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gitBranch` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_propsdata`
-- ----------------------------
DROP TABLE IF EXISTS `v60_propsdata`;
CREATE TABLE `v60_propsdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `targetProduct` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `targetProduct_index` (`targetProduct`(128)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_settings`
-- ----------------------------
DROP TABLE IF EXISTS `v60_settings`;
CREATE TABLE `v60_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultSelected` int(11) DEFAULT '0',
  `level1` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level2` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level3` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level2_order` int(11) NOT NULL,
  `level3_order` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `descText` mediumtext COLLATE utf8mb4_unicode_ci,
  `xmlText` varchar(4095) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xmlFileName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xmlNode1` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `xmlNode2` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `engName_index` (`engName`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_settingsdata`
-- ----------------------------
DROP TABLE IF EXISTS `v60_settingsdata`;
CREATE TABLE `v60_settingsdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v60_settingsdata_temp`
-- ----------------------------
DROP TABLE IF EXISTS `v60_settingsdata_temp`;
CREATE TABLE `v60_settingsdata_temp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_configdata`
-- ----------------------------
DROP TABLE IF EXISTS `v62_configdata`;
CREATE TABLE `v62_configdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_configdata_temp`
-- ----------------------------
DROP TABLE IF EXISTS `v62_configdata_temp`;
CREATE TABLE `v62_configdata_temp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_mkdata`
-- ----------------------------
DROP TABLE IF EXISTS `v62_mkdata`;
CREATE TABLE `v62_mkdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `targetProduct` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `targetProduct_index` (`targetProduct`(128))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_modifyhistory`
-- ----------------------------
DROP TABLE IF EXISTS `v62_modifyhistory`;
CREATE TABLE `v62_modifyhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `reason` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` int(11) NOT NULL,
  `userName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modifyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_products`
-- ----------------------------
DROP TABLE IF EXISTS `v62_products`;
CREATE TABLE `v62_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `auditState` int(255) NOT NULL,
  `modifyState` int(255) NOT NULL,
  `androidVersion` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `memorySize` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `EMMC` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetProduct` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soc` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userName` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gitBranch` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_propsdata`
-- ----------------------------
DROP TABLE IF EXISTS `v62_propsdata`;
CREATE TABLE `v62_propsdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `targetProduct` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `curValue` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `targetProduct_index` (`targetProduct`(128)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_settings`
-- ----------------------------
DROP TABLE IF EXISTS `v62_settings`;
CREATE TABLE `v62_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultSelected` int(11) DEFAULT '0',
  `level1` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level2` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level3` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level2_order` int(11) NOT NULL,
  `level3_order` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `descText` mediumtext COLLATE utf8mb4_unicode_ci,
  `xmlText` varchar(4095) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xmlFileName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xmlNode1` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `xmlNode2` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `engName_index` (`engName`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_settingsdata`
-- ----------------------------
DROP TABLE IF EXISTS `v62_settingsdata`;
CREATE TABLE `v62_settingsdata` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `v62_settingsdata_temp`
-- ----------------------------
DROP TABLE IF EXISTS `v62_settingsdata_temp`;
CREATE TABLE `v62_settingsdata_temp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chip` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `panel` int(11) NOT NULL DEFAULT '0',
  `engName` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chip_index` (`chip`(8)),
  KEY `model_index` (`model`(8))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Procedure structure for `v60_copy_temp_to_data`
-- ----------------------------
DROP PROCEDURE IF EXISTS `v60_copy_temp_to_data`;
DELIMITER ;;
CREATE DEFINER=`scmplatform`@`%` PROCEDURE `v60_copy_temp_to_data`(IN chip_p char(255), IN model_p char(255), IN panel_p int)
BEGIN

    delete from v60_configdata where chip=chip_p and model=model_p and panel=panel_p;
    insert into v60_configdata (chip, model, panel, engName, curValue)
        select chip, model, panel, engName, curValue from v60_configdata_temp
            where v60_configdata_temp.chip=chip_p and v60_configdata_temp.model=model_p and v60_configdata_temp.panel=panel_p;
            
    delete from v60_settingsdata where chip = chip_p and model = model_p and panel=panel_p;
    insert into v60_settingsdata (chip, model, panel, engName)
        select chip_p, model_p, panel_p, engName from v60_settingsdata_temp
            where v60_settingsdata_temp.chip = chip_p and v60_settingsdata_temp.model = model_p and v60_settingsdata_temp.panel = panel_p;
			
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for `v62_copy_temp_to_data`
-- ----------------------------
DROP PROCEDURE IF EXISTS `v62_copy_temp_to_data`;
DELIMITER ;;
CREATE DEFINER=`scmplatform`@`%` PROCEDURE `v62_copy_temp_to_data`(IN chip_p char(255), IN model_p char(255), IN panel_p int)
BEGIN

    delete from v62_configdata where chip=chip_p and model=model_p and panel=panel_p;
    insert into v62_configdata (chip, model, panel, engName, curValue)
        select chip, model, panel, engName, curValue from v62_configdata_temp
            where v62_configdata_temp.chip=chip_p and v62_configdata_temp.model=model_p and v62_configdata_temp.panel=panel_p;
            
    delete from v62_settingsdata where chip = chip_p and model = model_p and panel=panel_p;
    insert into v62_settingsdata (chip, model, panel, engName)
        select chip_p, model_p, panel_p, engName from v62_settingsdata_temp
            where v62_settingsdata_temp.chip = chip_p and v62_settingsdata_temp.model = model_p and v62_settingsdata_temp.panel = panel_p;
			
END
;;
DELIMITER ;













