/***
 * 按下+、-后，先判断是否有*、/，有的话，计算整个算式
 * 没有的话，计算当前加减法，
 * 计算加减法：取当前值、弹出operatorNumber中的值、弹出操作符，进行计算；更新输入框；
 * 计算乘除法：取当前值、弹出operatorNumber中的一个值、弹出操作符，进行计算；更新输入框；再次计算
 * 操作符号数组只保留一个加减法、一个乘除法，
 * 输入加减法后，如果当前操作符号数组里只有一个加减法，则计算结果之前的结果，并压入当前加减法
 * 输入乘除法后，如果当前操作符号数组里只有一个加减法，压入当前数、操作符，不计算，等待下一个操作数
 * 压入操作数时，判断操作符是否是乘除法，是的话进行计算
 ***/

var refreshInputArea;
var equalSignPressed; //标志是否按下了=号
var equalValue;

window.onload = function() {
    document.getElementById("one").addEventListener("click", function() { pressValue(1) });
    document.getElementById("two").addEventListener("click", function() { pressValue(2) });
    document.getElementById("three").addEventListener("click", function() { pressValue(3) });
    document.getElementById("four").addEventListener("click", function() { pressValue(4) });
    document.getElementById("five").addEventListener("click", function() { pressValue(5) });
    document.getElementById("six").addEventListener("click", function() { pressValue(6) });
    document.getElementById("seven").addEventListener("click", function() { pressValue(7) });
    document.getElementById("eight").addEventListener("click", function() { pressValue(8) });
    document.getElementById("nine").addEventListener("click", function() { pressValue(9) });
    document.getElementById("zero").addEventListener("click", function() { pressValue(0) });

    document.getElementById("clearSign").addEventListener("click", function() { pressClear() });
    document.getElementById("iniSign").addEventListener("click", function() { iniAll() });


    document.getElementById("percent").addEventListener("click", function() { percent() });
    document.getElementById("equalSign").addEventListener("click", function() { pressEqual() });

    document.getElementById("plus").addEventListener("click", function() { pressPlusOrMinus("+") });
    document.getElementById("minus").addEventListener("click", function() { pressPlusOrMinus("-") });

    iniAll();

}

function iniAll() {
    operatorSign = [];
    operatorNumber = [0];
    restoreIinputArea();

    readyToRefresh();
    equalPressed();
    
    equalValue = 0;
}

function traceInformation() {
    console.log("Trace...\n");
    console.log("Current operator sign:" + operatorSign + "\t Length:" + operatorSign.length);
    console.log("Current operatorNumber:" + operatorNumber + "\t Length:" + operatorNumber.length);
}

//triggered by press AC
function pressClear() {
    //清空输入框
    restoreIinputArea();
    //清空中间过程
}

//更新inputArea的内容
function updateInputArea(newValue) {
    document.getElementById("inputArea").value = newValue;
}

//清空inputArea的内容
function restoreIinputArea() {
    document.getElementById("inputArea").value = "0";
    pressValue(0);
}

//获取、设定是否需要刷新输入区域的状态
//Ready代表需要更新，用在计算结果显示，显示后再输入数字，要刷新整个字符串
//End代表已经完成更新，再输入数字后，不需要刷新整个字符串
function readyToRefresh() {
    setRefreshInputArea("Ready");
}

function endToRefresh() {
    setRefreshInputArea("End");
}

function setRefreshInputArea(value) {
    refreshInputArea = value;
}

function getRefreshStatus() {
    return (refreshInputArea);
}

function equalPressed() {
    equalSignPressed = "EqualPressed";
}

function equalReleased() {
    equalSignPressed = "EqualUNPressed";
}

function getEqualStatus() {
    return (equalSignPressed);
}

//triggered by press %
function percent() {
    equalReleased();

    //百分比
    var currentValue = document.getElementById("inputArea").value;
    if (String(currentValue) == "") {
        //nothing to enter
        console.log("nothing");
    } else {
        currentValue = currentValue / 100;
        document.getElementById("inputArea").value = currentValue;
        console.log("percent");
    }
}


function pressValue(inputValue) {
    equalReleased();

    var currentValue = String(document.getElementById("inputArea").value);
    console.log(currentValue, inputValue);


    if ((inputValue == 0) && (currentValue == "")) {
        currentValue = inputValue;
    } else if (currentValue == "0" || getRefreshStatus() == "Ready") {
        endToRefresh();
        currentValue = inputValue;
    } else {
        currentValue = currentValue + String(inputValue);

    };

    /***
    if (operatorNumber.length == 1 && operatorNumber[0] == 0) {
        operatorNumber.pop();
        operatorNumber.push(currentValue);
    }
***/

    updateInputArea(currentValue);


}

//triggered by press +,-
function pressPlusOrMinus(operatorPlusOrMinus) {
    var sum;

    equalReleased();
   
    console.log("pressPlusOrMinus" + operatorPlusOrMinus);
    var currentValue = parseFloat(document.getElementById("inputArea").value);
    
    
    if (operatorSign.length == 0) {
        console.log("Operator sign = 0:");
        operatorSign.push(operatorPlusOrMinus);
        console.log("Operator sign pushed:" + operatorSign);
    } else {
        
        tempOperator = operatorSign.pop();
        
        switch (tempOperator) {
            case "+":
            sum = parseFloat(operatorNumber.pop()) + currentValue;
            break;
            case "-":
            sum = parseFloat(operatorNumber.pop()) - currentValue;
            break;
        };
        
        operatorNumber.push(sum);
        operatorSign.push(operatorPlusOrMinus);
        updateInputArea(sum);

        console.log("Current operator popped from sign:" + tempOperator + "\n");

    };

    readyToRefresh();

    traceInformation();

}


function pressEqual() {

    if (getEqualStatus() == "EqualUNPressed") {
        var currentValue = parseFloat(document.getElementById("inputArea").value);
        equalValue = currentValue;
        equalPressed();
    }


    if (operatorSign.length == 0) {

    } else {
        tempOperator = operatorSign[operatorSign.length - 1];

        switch (tempOperator) {
            case "+":
                var sum = parseFloat(operatorNumber.pop()) + equalValue;

                operatorNumber.push(sum);
                updateInputArea(sum);

                console.log("Current operator popped from sign:" + tempOperator + "\n");
                break;
        }
    }
}




























function setOperatorNumberAdded(value) {
    operatorNumberAdded = value;
    console.log("New operatorNumberAdded:" + operatorNumberAdded);
}

function getOperatorNumberAdded() {
    return operatorNumberAdded;
}



function addNewOperatorNumber(addNewOperatorNumber) {
    operatorNumber.push(addNewOperatorNumber);
    console.log("operatorNumber:" + operatorNumber);
}





function devide(operator1, operator2) {
    //除法
}

function multiple(operator1, operator2) {
    //乘法
}



function minus(operator1, operator2) {
    //减法
}




function getResult(sign) {
    console.log("operatorSign:" + operatorSign.length);
    console.log("operatorNumber:" + operatorNumber.length);

    if (operatorSign.length == 0 || operatorNumber.length == 0) {
        //已经完成计算 或者 哪里错了
        operatorNumber[0] = 0;
        console.log("Nothing to caculat...")
    } else {
        //计算结果
        var operator1 = document.getElementById("inputArea").value;
        var operator2 = operatorNumber.pop();
        switch (sign) {
            case "=":
            case "+":
                updatePlus(sign);
            case "-":
            case "*":
            case "/":
        }
    }
}



function updatePlus(sign) {
    if (operatorNumber.length == 0) {
        operatorNumber.push(0);
        operatorSign.push(sign);
    } else {
        var operator1 = operatorNumber.pop();
        var operator2 = document.getElementById("inputArea").value;

        var result = plus(operator1, operator2);
        operatorNumber.push(result);
        updateInputArea(result);
    }
}

function plus(operator1, operator2) {
    //加法
    //判断是否需要计算
    //更新操作数数值
    //更新操作符号数组
    console.log(operator1 + "+" + operator2);
    return (operator1 + operator2);

}