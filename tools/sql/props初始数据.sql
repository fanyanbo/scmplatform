/*
Navicat MySQL Data Transfer

Source Server         : 172.20.5.239
Source Server Version : 50547
Source Host           : 172.20.5.239:3306
Source Database       : scm

Target Server Type    : MYSQL
*/

INSERT INTO `props` (engName, defaultValue, category, descText) VALUES 
	('third.get.quickplay', '0', '设置', '平台播放器是否支持先seek再start; 参考值0|1 '),
	('lafite.tts.close', '0', '语音', '是否关闭tts; 参考值0|1 '),
	('ro.build.skyform', 'TV', 'Coocaa SDK', '设备形状; 参考值:Box|TV'),
	('third.get.4k', '0', '在线影视', '是否支持在线4k播放; 参考值0|1 '),
	('third.get.h265', '0', '在线影视', '是否支持在线h265; 参考值0|1 '),
	('third.get.ms.dolby', '0', '在线影视', '是否支持在线dolby和dd+; 参考值0|1 '),
	('third.get.hdr.enable', '0', '在线影视', '是否支持在线hdr视频; 参考值0|1 '),
	('third.get.menuview.show', '0', '在线影视','当前在线菜单是否在显示【海思平台专用】; 参考值0|1 ');






