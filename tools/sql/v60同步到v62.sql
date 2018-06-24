insert into v62_products (chip, model, memorySize, EMMC, targetProduct, soc, gitBranch)
	select chip, model, memorySize, EMMC, targetProduct, soc, gitBranch from v60_products;


insert into v60_propsdata (targetProduct, engName, curValue)
	select b.name, a.engName, a.defaultValue from props as a cross join targetProducts as b;
insert into v62_propsdata (targetProduct, engName, curValue)
	select b.name, a.engName, a.defaultValue from props as a cross join targetProducts as b;

	
insert into v60_settingsdata (chip, model, engName)
	select b.chip, b.model, a.engName from v60_settings as a cross join v60_products as b where a.defaultSelected = 1;
insert into v62_settingsdata (chip, model, engName)
	select b.chip, b.model, a.engName from v62_settings as a cross join v62_products as b where a.defaultSelected = 1;

	
	
	
	