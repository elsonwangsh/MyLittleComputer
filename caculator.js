/***
 * 按下计算符：+/-，立刻计算结果，并将结果放到操作数数组，操作符放入再次操作符，操作数放入再次操作数
 * 按下等号：立刻计算结果，并将结果放到操作数数组，操作符放入再次操作符
 * 连按等号：用操作数中的结果，再次操作符，
 ***/

var refreshInputArea;
var equalSignPressed; //标志是否按下了=号
var equalValue;
var caculated = "Ready"; //判断是否已经完成计算
var operatorSign = [];
var operatorNumber = [];

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

    document.getElementById("plus").addEventListener("click", function() { pressPlus() });
    document.getElementById("minus").addEventListener("click", function() { pressMinus() });

    iniAll();

}

function iniAll() {
    operatorSign = [];
    operatorNumber = [];
    caculated = "Ready";


    restoreInputArea();
    readyToRefresh();
    equalReleased();

    equalValue = 0;
}

function traceInformation() {
    console.log("Trace...................................\n");
    console.log("Current operator sign:" + operatorSign + "\t Length:" + operatorSign.length);
    console.log("Current operatorNumber:" + operatorNumber + "\t Length:" + operatorNumber.length);
    console.log("Caculated:" + caculated);
    console.log("getEqualStatus():" + getEqualStatus());
}

//triggered by press AC
function pressClear() {
    //清空输入框
    restoreInputArea();
    //清空中间过程
}

//更新inputArea的内容
function updateInputArea(newValue) {
    document.getElementById("inputArea").value = String(newValue);
}

//清空inputArea的内容
function restoreInputArea() {
    document.getElementById("inputArea").value = "0";
    //pressValue(0);
}

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
    equalSignPressed = "EqualValueCashed";
}

function equalPressedAgain() {
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

    if (getEqualStatus() == "EqualValueCashed") {
        iniAll();
    }

    var currentValue = String(document.getElementById("inputArea").value);

    if (currentValue == "0" && inputValue == 0) {

        endToRefresh();
        currentValue = inputValue;

    } else if (currentValue == "0" || getEqualStatus() == "EqualUNPressed") {
        endToRefresh();
        currentValue = inputValue;
        equalSignPressed = "needMore";
    } else if (equalSignPressed == "needMore") {
        currentValue = currentValue + String(inputValue);
    };

    updateInputArea(currentValue);

}

function updateOperatorNumber(inputValue) {
    operatorNumber.push(parseFloat(inputValue));
    console.log("OperatorNumber updated.");
}

function updateOperatorSign(inputSign) {
    var status = "Not pushed.";
    if (operatorSign.length == 0) {
        operatorSign.push(inputSign);
        status = inputSign + "\tpushed.";
    }
    console.log(status);
    return status;
}

function startToCaculate(tempSign) {



    if (operatorSign.length > 2 && operatorSign.length < 1) {
        console.log("operatorSign.length error.")
    } else {
        if (operatorSign.length == 0) {
            updateOperatorSign(tempSign);
        } else {

            for (var tempIndex = 0; tempIndex < operatorSign.length; tempIndex++) {
                var value1, value2 = 0;
                var operator = "";
                console.log("operatorNumber:" + operatorNumber);
                value2 = parseFloat(operatorNumber.pop());
                value1 = parseFloat(operatorNumber.pop());
                operator = operatorSign.pop();

                var result = caculate(value1, value2, operator);

                updateOperatorNumber(result);
                updateInputArea(result);
                console.log("Begin to caculat:" + result);

            }

            updateOperatorSign(tempSign);
            traceInformation();

            equalReleased();
        }
    }

}

function caculate(value1, value2, operator) {
    var result = "No result.";
    console.log("value1:" + value1 + "\tvalue2:" + value2 + "\toperator:" + operator);
    switch (operator) {
        case "+":
            console.log("Precessing plus:");
            result = value1 + value2;
            break;
        case "-":
            result = value1 - value2;
            break;
        case "*":
            result = value1 * value2;
            break;
        case "/":
            if (value2 == 0) {} else {
                alert("Devide by zero.")
                result = value1 / value2;
            }
            break;
    };

    return result;
}

//判断是否当初始化后，直接按下操作符号，如果是的话，要在操作数里补一个操作数：0
function patchAZero() {
    if (operatorNumber.length == 0) {
        operatorNumber.push(0);
        return "Zero Patched."
    } else { return "Nothin Patched." };

}


function pressOperator(tempOperator) {
    if (getEqualStatus() == "EqualValueCashed") {
        equalReleased();
    } else {
        if (getEqualStatus() == "EqualUNPressed") {
            readyToRefresh();

            updateOperatorNumber(document.getElementById("inputArea").value);

            startToCaculate(tempOperator);
        }
    }
}

function pressPlus() {
    pressOperator("+");
}

function pressMinus() {

}

function pressEqual() {

    if (getEqualStatus() == "EqualUNPressed") {
        var currentValue = parseFloat(document.getElementById("inputArea").value);
        equalValue = currentValue;
        equalPressed();
    }

    if (getEqualStatus() == "EqualValueCashed") {

        if (operatorSign.length == 0) {

        } else {
            tempOperator = operatorSign[operatorSign.length - 1];

            var result = caculate(operatorNumber.pop(), equalValue, tempOperator);

            updateOperatorNumber(result);
            updateInputArea(result);
            //equalReleased();
            console.log("Current operator popped from sign:" + tempOperator + "\n");
        }
    }


}








//triggered by press +,-
function pressPlusOrMinus(operatorPlusOrMinus) {
    console.log("Plus or Minus");
    /***
        equalReleased();

        
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
      ***/
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