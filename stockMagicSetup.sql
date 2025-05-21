create table users(
	userID integer primary key,
	username nvarchar(32) not null,
	email text not null,
	pwd text not null,
	fName text not null,
	lName text not null,
	funds money not null,
	routingNums integer not null);

create table fundsTXHist(
	fundsID integer primary key, 
	userID integer not null,
	txDate datetime default getdate(),
	depWith bit not null,
	fundAmount money not null,
	foreign key (userID) references users(userID));

create table stockTXHist(
	txID integer primary key,
	sym text not null,
	buySell bit not null,
	userID integer not null,
	qty integer not null,
	sellPrice money not null,
	txDate datetime default getdate(),
	foreign key (userID) references users(userID)
	);



	insert into users(userID, username, email, pwd, fName, lName, funds, routingNums) values
	(0000000001, 'MWazowski', 'MonsterMike@example.com', 'password', 'Mike', 'Wazowski', 12, 0000000000001234),
	(0000000002, 'Mr.Incredible', 'BobParr@example.com', 'password', 'Bob', 'Parr', 1209,0000000000003769),
	(0000000003, 'QuidditchWizzard', 'HPotter@example.com', 'password', 'Harry', 'Potter', 134029.27, 0000000000001111),
	(0000000004, 'QueenVess', 'LilianaVess@example.com', 'password', 'Liliana', 'Vess', 913.07, 0000000000005487);



	insert into stockTXHist(txID, sym, buySell, userID, qty, sellPrice) values
	(123456795, '$SONY', 1, 0000000004, 12, 24.67), 
	(123456789, '$GOOG', 1, 0000000001, 11, 159.27),
	(123456790, '$MSFT', 1, 0000000002, 17, 452.04),
	(123456791, '$NVDA', 1, 0000000003, 7, 134.11),
	(123456792, '$CDPR', 0, 0000000004, 78, 15.21),
	(123456793, '$CDPR', 1, 0000000004, 93, 6.40),
	(123456794, '$SONY', 0, 0000000003, 42, 24.88);

	
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

	alter table users
	alter column username nvarchar(32) not null;


	select funds from users
	where userID =1;
	select sum(
	/*
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