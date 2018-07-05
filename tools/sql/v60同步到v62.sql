insert into v62_products (chip, model, memorySize, EMMC, targetProduct, soc, gitBranch, platform, androidVersion)
	select chip, model, memorySize, EMMC, targetProduct, soc, gitBranch, platform,androidVersion from v60_products;

insert into v62_mkdata(targetProduct, engName)
	select targetProduct, engName from v60_mkdata;
	
	
insert into v60_propsdata (targetProduct, engName, curValue)
	select b.name, a.engName, a.defaultValue from props as a cross join targetProducts as b;
insert into v62_propsdata (targetProduct, engName, curValue)
	select b.name, a.engName, a.defaultValue from props as a cross join targetProducts as b;

	
insert into v60_settingsdata (chip, model, engName)
	select b.chip, b.model, a.engName from v60_settings as a cross join v60_products as b where a.defaultSelected = 1;
insert into v62_settingsdata (chip, model, engName)
	select b.chip, b.model, a.engName from v62_settings as a cross join v62_products as b where a.defaultSelected = 1;

insert into v62_configdata (chip, model, engName, curValue)
	select chip, model, engName, curValue from v60_configdata;
insert into v60_configdata_temp (chip, model, engName, curValue)
	select chip, model, engName, curValue from v60_configdata;
insert into v62_configdata_temp (chip, model, engName, curValue)
	select chip, model, engName, curValue from v62_configdata;
	
insert into v60_settingsdata_temp (chip, model, engName)
	select chip, model, engName from v60_settingsdata;
insert into v62_settingsdata_temp (chip, model, engName)
	select chip, model, engName from v62_settingsdata;
	
	
	
	
	
	
	