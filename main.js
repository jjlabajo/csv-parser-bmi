let columns = {
    h: 'Height (in m)',
    w: 'Weight (in kg)'
}
function getBMI(w,h){
    return Math.round(w / Math.pow(h, 2));
}

function printDetails(details){
    let details_markup = details.map(function(detail){
        return `
            <div class="col-sm-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${detail['Name']}</h5>
                        <hr>
                        <p class="card-text"><b>${columns.w}</b> : &nbsp; ${detail[columns.w]}</p>
                        <p class="card-text"><b>${columns.h}</b> : &nbsp; ${detail[columns.h]}</p>
                        <h6 class="card-subtitle mb-2 text-muted">BMI: ${detail['BMI']}</h6>
                        <span class="badge bg-${detail['severity']}">${detail['category']}</span>
                    </div>
                </div>
            </div>
        `
    }).join("")
    document.getElementById('result').innerHTML = `<div class="row">${details_markup}</div>`
}

function upload(that){
    Papa.parse(that.files[0], {
        complete: function(results) {
            let details = []
            let data = results['data']
            for(let key in data){
                if(key == 0){
                    continue
                }
                let index = key - 1
                if(details[index] == null){
                    details[index] = {}
                }
                for(let y in data[key]){
                    let column = data[0][y].trim()
                    if(column == ""){
                        continue;
                    }
                    details[index][column] = data[key][y]
                }
            }
            for(let x in details){
                let detail = details[x]
                console.log(detail)
                if(detail[columns.h] == null || detail[columns.w] == null){
                    details.splice(x, 1);
                    continue
                }
                let bmi = getBMI(detail[columns.w], detail[columns.h])
                let category = ''
                let severity = ''
                if(bmi < 18.5){
                    category = 'Underweight'
                    severity = 'danger'
                }else if(bmi < 25){
                    category = 'Normal weight'
                    severity = 'success'
                }else if(bmi < 30){
                    category = 'Overweight'
                    severity = 'warning'
                }else{
                    category = 'Obesity'
                    severity = 'danger'
                }
                details[x]['BMI'] = bmi
                details[x]['category'] = category
                details[x]['severity'] = severity
            }
            printDetails(details)
        }
    });
}


