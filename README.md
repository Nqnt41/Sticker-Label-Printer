<a name="readme-top"></a>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#prerequisites-and-local-installation">Prerequisites and Local Installation</a></li>
    <li><a href="#locally-running-the-project">Locally Running the Project</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

This project was developed for use by the staff at Joey's Seafood Shack in Vero Beach, Florida. This restaurant specializes in both seafood and Italian cuisine, doing both sit-in and take-out dining.

For take-out meals at this restaurant, specific sticker labels are used in order to mark the containers, showing customers what food is in the container, its portions, the restaurant name and address, and more.

In order to streamline the process of preparing, saving, and printing these labels, I developed this full-stack software application that allows users to access the list of existing stickers, stored on a JSON file, alter that information, and print out any necessary labels.

This project combines both a ReactJS frontend, allowing for easy access to information, with a Java backend used primarily to edit the JSON file. Java Spark is used to connect these two aspects of the application.

A software application version of this project is in active development using the Electron framework.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

The frontend of this program was built with the React framework, which combines JavaScript, CSS, and HTML elements.

The backend, meanwhile, uses Java in order to manipulate JSON information.

Java Spark is used to connect these two sides of the program via POST, PUT, DELETE, and GET commands with a local database connection.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Prerequisites and Local Installation

* After creating a local repository, the following command can be used to pull the program from GitHub for use on a personal system
  ```sh
  git init
  git remote add https://github.com/Nqnt41/Sticker-server.Label-Printer.git
  git pull origin main
  ```

* Dependencies for running the project locally can be installed simply by using the command:
  ```sh
  npm install npm@latest -g
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Locally Running the Project

TODO - backend and frontend.

## Contact

Ryan Coveny - please contact me with any concerns via ryanpcoveny@gmail.com

Project Link: [https://github.com/Nqnt41/Sticker-Label-Printer.git](https://github.com/Nqnt41/Sticker-Label-Printer.git)
