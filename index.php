<?php
if(isset($_POST['submit'])){
$userName = "".$_POST['username']."";
$Pass = "".$_POST['password']."";
$first = "".$_POST['first']."";
$last = "".$_POST['last']."";
$email = "".$_POST["email"]."";



$file=fopen("account.txt", "a");
fwrite(stream: $file, data: "Contact");
fwrite(stream: $file, data: "\n");
fwrite($file, $userName);
fwrite(stream: $file, data: "\n");
fwrite($file, $Pass);
fwrite(stream: $file, data: "\n");
fwrite(stream: $file, data: $first);
fwrite(stream: $file, data: "\n");
fwrite(stream: $file, data: $last);
fwrite(stream: $file, data: "\n");
fwrite(stream: $file, data: $email);
fwrite(stream: $file, data: "\n");
fwrite(stream: $file, data: "0");
fwrite(stream: $file, data: "\n");
fclose($file);
}

$lines = @fopen("account.txt", 'r');

if($lines) {
    $array = explode("\n", fread($lines, filesize("account.txt")));
}


?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Stock Magic</title>
        <link rel="stylesheet" href="style.css">
        <link rel="icon" type="image/png" href="img/StockMagicLogo.png">
    </head>
   
    <nav class="topnav">
        <a class="active" href="index.html">Home</a>
        <a  href="contactUs.html">Contact</a>
        <div class="login-container">
            <form id="loginForm">
                
                <input type="text" id= "username" placeholder="Username" name="username">
                <input type="password" id="password" placeholder="Password" name="psw">
                <button type="submit" id="login">Login</button>
                <br>
                <span id="message" style="color: rgb(243, 20, 20);"></span>
            </form>
    
         </div>
    </nav>


<body class="index-background">
    
    <h1 style="color: white; text-align: center; font-size: 32px; text-shadow: 3px 3px 5px green;">STOCK MAGIC</h1>

    <div id=changingMessage>
        <span>Your</span>
        <div id=flip>
          <div><div>Future</div></div>
          <div><div>Wealth</div></div>
          <div><div>Choice</div></div>
        </div>
        <span>is in your hands!</span>
      </div>
    

    <div class="createAccount">
            <button type="submit" id="createAccount" onclick="openCreate()">Join Today!</button>
      </div>


    <div class="form-popup" id="createForm">
        <form id="formCreate" class="formCreate" method="post">

            <h1>Create Account</h1>
            <p>Please fill in this form to create an account.</p>
            <hr>

            <label for="fName">First Name</label>
            <input type="text" id="fname" name="first" placeholder="Your first name" required>

            <label for="lName">Last Name</label>
            <input type="text" id="lname" name="last" placeholder="Your last name" required>
         
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Your email address" required>
        
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Your Username" required>
         
            <label for="password">Password</label>
            <input type="password" id="password" name="password" aria-placeholder="Password" required>
    
            <button type="submit" name="submit" value="SAVE" class="createButton" onclick="accountCreated()">Create Account</button>
            <button type="button" class="cancelButton" onclick="closeForm()">Close</button>
        </form>
    </div>
    <input type="hidden" id="phpArray" value="<?php echo htmlspecialchars(json_encode($array)); ?>">

    <script src="script.js"></script>

    <footer style="position: fixed; bottom: 10px; left: 44vw;">
        <p style="color: white;">Copyright &copy; 2025</p>
    </footer>
</body>
</html>