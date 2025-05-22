create table users(
	userID integer identity(1,1) primary key,
	username varchar(255) not null,
	email varchar(255) not null,
	pwd varchar(255) not null,
	fName varchar(255) not null,
	lName varchar(255) not null,
	funds money not null,
	routingNums integer not null);

create table fundsTXHist(
	fundsID integer identity(1,1) primary key, 
	userID integer not null,
	txDate datetime default getdate(),
	depWith bit not null,
	fundAmount money not null,
	foreign key (userID) references users(userID));

create table stockTXHist(
	txID integer identity(1,1) primary key,
	sym varchar(255) not null,
	buySell bit not null,
	userID integer not null,
	qty integer not null,
	sellPrice money not null,
	txDate datetime default getdate(),
	foreign key (userID) references users(userID)
	);



	insert into users(username, email, pwd, fName, lName, funds, routingNums) values
	('MWazowski', 'MonsterMike@example.com', 'password', 'Mike', 'Wazowski', 12, 0000000000001234),
	('Mr.Incredible', 'BobParr@example.com', 'password', 'Bob', 'Parr', 1209,0000000000003769),
	('QuidditchWizzard', 'HPotter@example.com', 'password', 'Harry', 'Potter', 134029.27, 0000000000001111),
	('QueenVess', 'LilianaVess@example.com', 'password', 'Liliana', 'Vess', 913.07, 0000000000005487);



	insert into stockTXHist(sym, buySell, userID, qty, sellPrice) values
	('$SONY', 1, 0000000004, 12, 24.67), 
	('$GOOG', 1, 0000000001, 11, 159.27),
	('$MSFT', 1, 0000000002, 17, 452.04),
	('$NVDA', 1, 0000000003, 7, 134.11),
	('$CDPR', 0, 0000000004, 78, 15.21),
	('$CDPR', 1, 0000000004, 93, 6.40),
	('$SONY', 0, 0000000003, 42, 24.88);

	
	insert into fundsTXHist(userID, depWith, fundAmount) values
	(0000000001, 1, 24367.42),
	(0000000001, 0, 313.12),
	(0000000002, 1, 1209),
	(0000000003, 1, 3049),
	(0000000003, 1, 401),
	(0000000004, 0, 1245.96);
	select * from fundsTXHist
	select * from stockTXHist
	select * from users
/*
	alter table users
	alter column username nvarchar(32) not null;

	drop table stockTXHist
	drop table fundsTXHist
		drop table users

	select funds from users
	where userID =1;
	select sum(
	
	select * from stockTXHist

	alter table fundsTXHist
	drop constraint PK__fundsTXH__9B1C55F9F65B09BD;
	go
	alter table fundsTXHist
	alter column fundsID int not null
	alter table fundsTXHist add primary key (fundsID)

alter table fundsTXHist
add fundsID money;
alter table fundsTXHist
alter column fundsID money not null;
alter table fundsTXHist
add constraint PK_Funds primary key (fundsID);

alter table fundsTXHist
alter column fundsID int primary key;


	insert into fundsTXHist(fundsID, userID, depWith, fundAmount) values
	(987654321, 0000000001, 1, 24367.42),
	(987654322, 0000000001, 0, 313.12),
	(987654323, 0000000002, 1, 1209),
	(987654326, 0000000003, 1, 3049),
	(987654325, 0000000003, 1, 401),
	(987654324, 0000000004, 0, 1245.96);
	select * from fundsTXHist
	select * from stockTXHist
	select * from users

	*/