/***
 * 1，+；1，+，2；1，+，2，+
 *等待操作数1：输入操作数1；按下操作符1，判断是否可计算（肯定不可计算），如不可计算，等待操作数2；如可计算，计算结果，结果替换操作数1，等待操作数2；
 *等待操作数2：输入操作数2，按下操作符2，判断是否可计算；如不可计算（操作符2是乘除法），保存操作符2，等待操作数3；如可计算（操作符2是加减法），计算整个结果，结果替换操作数1，将操作符2替换操作符1，等待操作数2；
 *等待操作数3：输入操作数3，按下操作符3，如果操作符3是乘除法，用操作符3计算操作数2、3，将结果替换操作数2，将操作符3替换操作符2，等待操作数3；如操作符3是加减法，计算整个结果，结果替换操作数1，将操作符2替换操作符1，等待操作数2；
 * 
 *等待操作数1：按下操作符，将0作为操作数1，保存操作符1，等待操作数2；
 *等待操作数2：按下操作符，将新的操作符替换上次操作符，等待操作数2；
 *
 *等待操作符数3：按下操作符，将新的操作符替换上次操作符，等待操作数3；
 * 
 *按下操作符：保存到临时操作符，保存输入框内容为临时操作数
 *按下等号：第一次按下等号，计算结果，清空操作数组，将结果保存到操作数1，清空操作符号
 *持续按下等号： 将操作数，临时操作符，临时操作数进行计算；计算结果保存到操作数1；
 ***/

var refreshInputArea;
var equalSignPressed; //标志是否按下了=号
var equalValue;
var flagReflash = "toReflash"; //判断是否已经完成计算，需要更新：toReflash；需要追加：toAppend
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
    operatorSign = []; //清空操作符数组
    operatorNumber = []; //清空操作数数组
    flagReflash = "toReflash" //刷新标志设定为需要刷新


    restoreInputArea();
    equalReleased();

    equalValue = 0;
}


//triggered by press AC
function pressClear() {
    //清空输入框
    restoreInputArea();
    //清空中间过程
}

//清空输入框的内容
//将输入框更新标志设定为：需要更新 toReflash
function restoreInputArea() {
    document.getElementById("inputArea").value = "0";
    setFlahReflesh("toReflash");
}

//设定输入框的内容，当结果更新后，需要设定输入框的内容
function setInputArea(newValue) {
    document.getElementById("inputArea").value = String(newValue);
}

function setFlahReflesh(tempFlagReflash) {
    flagReflash = tempFlagReflash
}

function getFlahReflesh() {
    return (flagReflash)
}

//当按下数字时执行
function pressValue(inputValue) {

    inputValue = String(inputValue);

    //判断是否需要立刻进行计算！！！

    //判断输入框是否需要刷新
    if (getFlahReflesh() == "toReflash") {
        if (inputValue == "0") {
            //当需要刷新时，按下了0，需要判断此时是否为0
            if (document.getElementById("inputArea").value == "0") {
                //当需要刷新时，按下了0，同时此时输入框已经是0了，那么什么事情也不做
                console.log("0 pressed when input area already be 0;")
            }
        } else {
            //当需要刷新时，按下了非0数字，那么，将输入框设定为0，同时将输入框更新标志设定为：需要追加 toAppend            
            setInputArea(inputValue);
            setFlahReflesh("toAppend");
            console.log("0 pressed when input area need to be appended;")
        }
    } else {
        //当输入框更新标志为：需要追加 toAppend 时，在当前输入框的最后，追加字符
        var currentValue = String(document.getElementById("inputArea").value);
        currentValue = currentValue + inputValue;
        setInputArea(currentValue);
    }

}

//当按下操作符号时执行
function pressOperator(tempOperator) {

    //判断是否存在已按下乘除法的标志，如果存在已按下乘除法的标志，代表在乘法后面直接按下了加减法，此时，应该：
    //取消最近的一次乘除法；计算整个算式；将操作结果设定为第一个操作数；将加减法设定为第一个操作符号；将结果更新到输入框；
    //将输入框刷新标志设定为等待新操作数
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
                setInputArea(result);
                console.log("Begin to caculat:" + result);

            }

            updateOperatorSign(tempSign);
            traceInformation();

            equalReleased();
        }
    }

}



//判断是否当初始化后，直接按下操作符号，如果是的话，要在操作数里补一个操作数：0
function patchAZero() {
    if (operatorNumber.length == 0) {
        operatorNumber.push(0);
        return "Zero Patched."
    } else { return "Nothin Patched." };

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
            setInputArea(result);
            //equalReleased();
            console.log("Current operator popped from sign:" + tempOperator + "\n");
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


function traceInformation() {
    console.log("Trace...................................\n");
    console.log("Current operator sign:" + operatorSign + "\t Length:" + operatorSign.length);
    console.log("Current operatorNumber:" + operatorNumber + "\t Length:" + operatorNumber.length);
    console.log("flagReflash:" + flagReflash);
    console.log("getEqualStatus():" + getEqualStatus());
}


//==============================



/***
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
***/


















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
                setInputArea(sum);
                
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
        setInputArea(result);
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