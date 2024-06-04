Basic nodejs program to scan a downloads folder for whenever specific files are downloaded. When downloaded, the program changes CSV's to XLSX's using csv-parser and exceljs libraries. 

Then, moves them to specific files specified by the user in separate config files.

config_backupLocationFolder.txt -> where the program moves a backup of the file, if it exists in the moveTo folder, to prevent accidental deletion. (although, if the file is already here, it will overwrite, you only get one mulligan)
config_moveToFolder.txt -> where the files are moved to after being processed.
config_downloadFolder.txt -> where the files will be coming in from.

You can specify each of the paths by creating a .txt file, and making the path relative to index.js. ex: ../../Downloads