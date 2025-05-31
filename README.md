<a name="readme-top"></a>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#project-prerequisites">Project Prerequisites</a></li>
    <li>
      <a href="#local-installation">Local Installation</a>
      <ul>
        <li><a href="#pulling-content-from-github">Pulling Content From GitHub</a></li>
        <li><a href="#setting-up-the-frontend">Setting Up the Frontend</a></li>
        <li><a href="#setting-up-the-backend">Setting Up the Backend</a></li>
      </ul>
    </li>
    <li><a href="#running-once-installed">Running Once Installedn</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

This project was developed for use by the staff at Joey's Seafood Shack in Vero Beach, Florida. This restaurant specializes in both seafood and Italian cuisine, doing both sit-in and take-out dining.

For take-out meals at this restaurant, specific sticker labels are used in order to mark the containers, showing customers what food is in the container, its portions, the restaurant name and address, and more.

In order to streamline the process of preparing, saving, and printing these labels, I developed this full-stack software application that allows users to access the list of existing stickers, stored on both a JSON file and MySQL database, alter that information, and print out any necessary labels.

This project combines both a ReactJS frontend, allowing for easy access to information, with a Java backend used to edit the JSON file/MySQL database. Java Spark is used to connect these two aspects of the application.

A software application version of this project is in active development using the Electron framework.

### Images

An example of how the main menu will look upon being loaded with only one entry present.

![The main menu's appearance with only one entry](https://github.com/Nqnt41/Sticker-Label-Printer/blob/main/README%20Images/J%2BK%20Image%201.JPG)

The page to add new labels - the editing labels page is a variation of this design, though with differing button options at the bottom of the screen.

![The appearance for the edit label page](https://github.com/Nqnt41/Sticker-Label-Printer/blob/main/README%20Images/J%2BK%20Image%202.JPG)

The preview for printing out a sticker label sheet.

![A preview for how a printer sticker sheet will look](https://github.com/Nqnt41/Sticker-Label-Printer/blob/main/README%20Images/J%2BK%20Image%203.JPG)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

The frontend of this program was built with the React framework, which combines JavaScript, CSS, and HTML elements.

The backend, meanwhile, uses Java in order to manipulate JSON information.

Java Spark is used to connect these two sides of the program via POST, PUT, DELETE, and GET commands with a local database connection.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Prerequisites

There are a few required downloads for this project to function. Their names and installation links are provided below.

* [Java SDK, specifically version 20 or higher. Any earlier version will not work.](https://www.oracle.com/java/technologies/downloads/)
* [NPM and Node.JS, in order to run the program frontend.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Apache Maven, in order to run the backend of the program from terminal.](https://maven.apache.org/download.cgi)

All other dependencies should be able to be set up if these prerequistes are installed and properly set up on a system. This section will be updated if any future requirements are introduced.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Local Installation

### Pulling Content From GitHub

Note the following instructions were written with a Windows machine in mind. This program can also be run on MacOS or Linux, just be careful of any differences that may exist between these devices and be prepared to use MacOS or Linux-specific commands if needed.

* After creating a local repository, the following command can be used to pull the program from GitHub for use on a personal system
  ```sh
  git init
  git remote add origin https://github.com/Nqnt41/Sticker-Label-Printer.git
  git pull origin main
  ```

### Setting Up the Frontend

* In order to install dependencies for the React.js part of the application on your local system, navigate to the root directory (used as the folder by which git information was pulled). Then, install the core npm react dependencies. The commands to do so are as follows:
  ```sh
  npm install ./frontend
  npm install -g create-react-app ./frontend
  ```
  * These commands can also be run from within the frontend directory by removing the "./frontend" part of the command. For simplicity, and because the backend is also run and installed from root, this method has been chosen.
* From there, use the following command to run the command from terminal:
  ```sh
  npm start --prefix ./frontend
  ```
  * Note that the frontend should, at this stage, be limited to just a "Loading..." screen, as it is designed to not actively run unless the backend program is also active. Should the backend ever stop running, the program will return to this state. When the backend is turned on, the frontend will begin working in turn.
  * This command can also be run from ./frontend by removing "--prefix ./frontend"
  * If the backend and frontend are to be run at once, two command line pages are required.
 
### Setting Up the Backend

* The first step towards setting up the backend is to install maven dependencies as well as create a .jar file to run through the terminal. To do so, run the following command, starting in the root directory (and not the backend directory):
  ```sh
  mvn install
  mvn clean compile
  mvn clean package
  ```
  * If this worked, a directory named "target" should have been made going off of root. It should contain two .jar files at the bottom, as well as four folders.
  * Unlike the frontend, the backend is required to be set up from within the root directory.
* From there, run the following command to run the backend .jar file.
  ```sh
  java -jar target/stickerPrinterBackend-1.0-SNAPSHOT.jar
  ```
  * The backend jar file is still actively being developed, tested, and updated. If any issues occur that prevent the program from being run, feel free to contact ryanpcoveny@gmail.com for help.
    
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Running Once Installed

Once the steps above have been completed, the project can be run entirely from the terminal.

* Navigate to the root directory and run the frontend in the first terminal with the command:
  ```sh
  npm start --prefix ./frontend
  ```
  * This should open a localhost:3000 tab on your browser of choice, if not open localhost on a web browser. If the backend is not running, a "Loading..." screen will be present, rather than the homepage.
* Open a second command prompt and navigate to the root directory. Run the following command to activate the backend of the program:
  ```sh
  java -jar target/stickerPrinterBackend-1.0-SNAPSHOT.jar
  ```
  * This should allow the frontend to navigate to its homepage automatically. Should the backend ever go down, the frontend will begin loading again until the backend returns.
  * The backend can be accessed through navigating to localhost:4567.
    * The JSON information used to store sticker data is accessible at localhost:4567/get-labels

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Ryan Coveny - please contact me with any concerns via ryanpcoveny@gmail.com

Project Link: [https://github.com/Nqnt41/Sticker-Label-Printer.git](https://github.com/Nqnt41/Sticker-Label-Printer.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
