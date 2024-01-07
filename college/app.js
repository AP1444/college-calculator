const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 3000;

let [page, internal, external, total] = ["--","--","--","--"];
let [subjects, totalGrade, totalCredit, sgpa] = [0,0,0,0];
let sn = 1;
let subjectDetails = [];

app.get("/", function (req, res) {
    [page, internal, external, total] = ["--","--","--","--"];
    [subjects, totalGrade, totalCredit, sgpa] = [0,0,0,0];
    sn = 1;
    subjectDetails = [];
    res.render("home");
});

app.get("/gradeCalculator", function (req, res) {
    res.render("theory");
});
app.get("/theory", function (req, res) {
    res.render("theory");
});

app.get("/hybrid", function (req, res) {
    res.render("hybrid");
});

app.get("/online", function (req, res) {
    res.render("online");
});

app.get("/SGPAcalculator", function (req, res) {
    res.render("SGPAcalculator");
});

app.get("/subject-details", function (req, res) {
    subjects = req.body.subjects;
    res.render("subject-details", { sn: sn });
});
app.post("/subject-details", function (req, res) {
    subjects = req.body.subjects;
    res.redirect("subject-details");
});

app.get("/final-result", function(req,res){
    res.render("final-result", { subjectDetails: subjectDetails, sgpa: sgpa })
})

app.post("/next", function (req, res) {
    let subject = {
        name: req.body.subjectname,
        credit: req.body.subjectcredit,
        grade: req.body.subjectgrade
    }
    subjectDetails.push(subject);
    

    if (subjects > sn) {
        sn++
        res.redirect("subject-details");
    } else {
        for(var i = 0; i<subjectDetails.length; i++){
            totalCredit += Number(subjectDetails[i].credit);
            totalGrade += mul(Number(subjectDetails[i].credit), subjectDetails[i].grade);
        }
        console.log(totalCredit);
        console.log(totalGrade);
        sgpa = totalGrade/totalCredit;
        res.redirect("final-result");
    }

});

app.post("/theory/result", function (req, res) {
    page = 'theory';
    let mst1 = Number(req.body.mst1);
    let mst2 = Number(req.body.mst2);
    let assignment = Number(req.body.assignment);
    let test = Number(req.body.test);
    let quiz = Number(req.body.quiz);
    let attendence = req.body.attendence;
    internal = ((mst1 + mst2) / 2) + assignment + (test / 3) + quiz;
    external = Number(req.body.est);

    total = internal + external;

    if (attendence === 'on') {
        total = total + 2;
    }
    console.log(total);

    res.render("result", { internal: internal, external: external, total: total });
});

app.post("/hybrid/result", function (req, res) {
    page = 'hybrid';
    let mst1 = Number(req.body.mst1);
    let mst2 = Number(req.body.mst2);
    let exp1 = Number(req.body.exp1);
    let exp2 = Number(req.body.exp2);
    let exp3 = Number(req.body.exp3);
    let exp4 = Number(req.body.exp4);
    let project = Number(req.body.project);
    let performance = Number(req.body.performance);
    let assignment = Number(req.body.assignment);
    let test = Number(req.body.test);
    let quiz = Number(req.body.quiz);
    let attendence = req.body.attendence;
    internal = ((mst1 + mst2) / 4) + ((exp1 + exp2 + exp3 + exp4) / 4) + ((project + performance) / 2) + assignment + (test / 3) + quiz;
    external = Number(req.body.est);

    total = internal + (external / 2);
    if (attendence === 'on') {
        total = total + 2;
    }

    console.log(total);

    res.render("result", { internal: internal, external: external, total: total });
});

app.post("/online/result", function (req, res) {
    page = 'online';
    let obtainedMarks = req.body.obtainedMarks;
    let maxMarks = req.body.maxMarks;
    internal = '--';
    external = '--';

    total = (obtainedMarks / maxMarks) * 100;
    console.log(total);

    let grade = gradeCal(total);

    res.render("result", { internal: internal, external: external, total: total, grade: grade });
});


function gradeCal(total) {
    let grade;
    if (total === 100 || total === 99) {
        grade = 'A+';
    }
    else if (total >= 95 && total < 99) {
        grade = 'Most probably A+ or A'
    }
    else if (total >= 90 && total < 95) {
        grade = 'A'
    }
    else if (total >= 80 && total < 90) {
        grade = 'B+'
    }
    else if (total >= 70 && total < 80) {
        grade = 'B'
    }
    else if (total >= 60 && total < 70) {
        grade = 'C+'
    }
    else if (total >= 50 && total < 60) {
        grade = 'C'
    }
    else if (total >= 40 && total < 50) {
        grade = 'D'
    }
    else if (total < 40) {
        grade = 'F'
    }

    return grade;
}

function mul(credit, grade) {
    
    switch (grade) {
        case 'A+' || 'a+':
            totalGrade = credit * 10;
            break;
        case 'A' || 'a':
            totalGrade = credit * 9;
            break;
        case 'B+' || 'b+':
            totalGrade = credit * 8;
            break;
        case 'B' || 'b':
            totalGrade = credit * 7;
            break;
        case 'C+' || 'c+':
            totalGrade = credit * 6;
            break;
        case 'C' || 'c':
            totalGrade = credit * 5;
            break;
        case 'D' || 'd':
            totalGrade = credit * 4;
            break;

        default:
            totalGrade = credit * 0;
            break;
    }
    return totalGrade;
}


app.listen(PORT, function () {
    console.log("Server started on port 3000");
});
