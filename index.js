const fs = require('fs')
const csv = require('csv-parser')
const ExcelJS = require('exceljs')

const downloads = fs.readFileSync('./config_downloadFolder.txt', {encoding: 'utf8'})
const moveTo = fs.readFileSync('./config_moveToFolder.txt', {encoding: 'utf8'})
const backupLocaiton = fs.readFileSync('./config_backupLocationFolder.txt', {encoding: 'utf8'})

fs.watch(downloads, (eventType, filename) => {
    if (eventType === 'rename' && filename) {
        if(fs.existsSync(downloads+filename)){
            console.error(`A new file ${filename} has been added to the folder.`)

            var newname = filename.replace('.csv', '.xlsx')
            if(newname.startsWith('REDACTED'))newname='REDACTED.xlsx';
            if(filename.startsWith("REDACTED") && filename.endsWith(".xlsx"))newname="REDACTED.xlsx";
            if(newname.startsWith("REDACTED"))newname="REDACTED.xlsx" 
            if(fs.existsSync(moveTo+newname)){fs.renameSync(moveTo+newname,backupLocaiton+newname);console.log("File backed up!")}



            if(filename.endsWith(".csv") && (newname == 'REDACTED.xlsx' || newname=='REDACTED.xlsx')) {
                console.error("CSV!")
                let workbook = new ExcelJS.Workbook();
                let worksheet = workbook.addWorksheet('Sheet 1');

                fs.createReadStream(downloads+filename)
                .pipe(csv())
                .on('headers', (headers) => {
                    worksheet.addRow(headers);
                })
                .on('data', (row) => {
                    var rowString = JSON.stringify(row).replace(`"}`,'')
                    rowString = rowString.split('","')
                    rowArr=[]
                    rowString.forEach(element => {
                        rowArr.push(element.split(`":"`)[1])
                    });
                    worksheet.addRow(rowArr);
                })
                .on('end', () => {
                    workbook.xlsx.writeFile(moveTo+newname)
                    .then(() => console.error(`Converted ${filename} to ${newname}`))
                    .catch((err) => console.error(err));
                    fs.unlink(downloads+filename, (err) => {
                        if(err)console.error("There was an error deleting file! See below. \n"+err)
                    })
        
                });

            }
            if(filename.startsWith("REDACTED") && filename.endsWith(".xlsx")){
                fs.renameSync(downloads+filename,moveTo+newname)
                console.log("REDACTED export detected! Renamed and moved!")
            }
            
        } else /*file not exists */ {
            console.error(filename + " deleted!")
        }
    }
});
