insert into v62_products (chip, model, memorySize, EMMC, targetProduct, soc, gitBranch)
	select chip, model, memorySize, EMMC, targetProduct, soc, gitBranch from v60_products;






