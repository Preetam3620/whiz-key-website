# Whiz-key-website

## How to use this repository

**1. Use the npm to install Node package manager**

```bash
npm install 
```

**2. To run the website**
```
node app.js
```

## File Structure

- ```app.js``` contains all the main javascript functions and the schema of the database.
 
- The ```public``` folder consists of ```css``` and ```js``` folder which has the code for styling the website and a date function respectively.

- ```views``` folder has the main ejs files
    
    -```detailed-report.ejs``` has the table of detailed reports of all the cycles and their statuses.
    
    -```summary-report.ejs``` has a summarized table of all the cycles and their statuses.
    
    -```patrials``` folder has the ```footer.ejs``` and ```header.ejs``` which have the header and the footer common for all the ejs pages.

## Instructions 

- The database containing the data is structured the same way as it is obtained from the log file.

- Database is structured in a way that an array of cycles is created and each cycle has the same data from the log file as key-value pairs.

- If there are any changes in the log file, keys have to be updated at ```<th>``` and  ```<td>```  in the ```detailed-report.ejs```.
