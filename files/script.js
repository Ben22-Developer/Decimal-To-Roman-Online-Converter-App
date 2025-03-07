const input_output = JSON.parse(localStorage.getItem('data')) || [];

const romanSymbols = [
    {
        symbol:'I', digits:1
    }, 
    {
        symbol:'V',digits:1
    },
    {
        symbol:'X',digits:2
    },  
    {
        symbol:'L',digits:2
    },
    {
        symbol:'C',digits:3
    },  
    {
        symbol:'D',digits:3
    },
    {
        symbol:'M',digits:4
    }         
];

const calculatorLogic = (() => {

    function inputValidation (input) {
        if (!input) {
            return 'Please enter a valid number';
        }
        else if (input <= 0) {
            return 'Please enter a number greater than or equal to 1';
        }
        else if (input > 3999) {
           return 'Please enter a number less than or equal to 3999' ;
        }
        else {
            return toSimplifyInput (Math.floor(input),0);
        }
    }

    function toSimplifyInput (input,pow) {

        let symbol;
        const quotient = Math.floor(input/10);

        if (input < 10) {
            symbol = toConvertInput (input,pow);
        }
        else {
            const pow_Incr = pow + 1;
            const pre_symbol = toSimplifyInput (quotient,pow_Incr);
            symbol = pre_symbol + toConvertInput(input % 10,pow);
        }
        return symbol;
    }

    function toConvertInput (input,pow) {

        //10,1 = 10
        const tenth_val = Math.pow(10,pow);

        // input = 2, pow = 1, 2*(10^1) = 20... 
        input = input * tenth_val;

        // 10^(1+1) = 100
        const pow_10 = Math.pow(10,(pow + 1)); 

        //6*(10^1) = 60
        const pow_6 = 6 * (Math.pow(10,pow)); 

        //1*(10^1) = 10
        const pow_1 = 1 * (Math.pow(10,pow)); 
        
        // X && L
        const currentSymbol = romanSymbols.filter(symbol => symbol.digits === (pow + 1)); 

        // 3, to facilitate  **nextSymbol
        const lastCurrentSymbolIndex = currentSymbol.indexOf(currentSymbol[currentSymbol.length - 1]);

        //for 9,90,900 ... we use next symbol if 90 we use roman C # XC
        const nextSymbol = romanSymbols[lastCurrentSymbolIndex + 1].symbol;

        let inputSymbol; 

        if (input === (pow_10 - pow_1)) {
            //case 90
            inputSymbol = String(currentSymbol[0].symbol) + String(nextSymbol);
        }
        else if (input === (pow_10 - pow_6)) {
            //case 40
            inputSymbol = String(currentSymbol[0].symbol) + String(currentSymbol[1].symbol)
        }
        else if (input > (pow_10 - pow_6)) {
            //case 50, 100 - 60, 50 > 40, (100 - 50)/10 = 5
            inputSymbol = String(currentSymbol[1].symbol) + String(toRepeatSymbols(currentSymbol[0].symbol,(pow_10 - (pow_10 - input))/tenth_val,5));
        }
        else {
            //case 20, (100 - (100 - 20))/10
            inputSymbol = String(toRepeatSymbols(currentSymbol[0].symbol,(pow_10 - (pow_10 - input))/tenth_val,0));
        }
        return inputSymbol;
    }


    function toRepeatSymbols (symbol,iterations,iterationBegin) {
        console.log(symbol,iterations,iterationBegin);
        let inputSymbol = '';
        for (let i = iterationBegin; i < iterations; i++) {
            inputSymbol += symbol;
        }
        return inputSymbol;
    }


    return{inputValidation}

})();

const UImanipulation = (() => {

    function outputFn (decimal,roman) {
        input_output.splice(0);
        input_output.push(decimal,roman);
        document.getElementById('input').innerText = input_output[0];
        document.getElementById('output').innerText = input_output[1];
        storage();
    }

    function storage () {
        const data = JSON.stringify(input_output);
        localStorage.setItem('data',data);
    }

    function retrieve () {
        outputFn(input_output[0],input_output[1]);
    }

    return {outputFn,retrieve}
})()

const inputDom = document.getElementById('number');

if (input_output.length) {
    UImanipulation.retrieve();
}

//DOM Manipulation

document.getElementById('convert-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const romanNbr = calculatorLogic.inputValidation(inputDom.value);
    UImanipulation.outputFn(inputDom.value,romanNbr);
    inputDom.value = '';
});

// document.addEventListener('keyup',() => {
//     if (!inputDom.value) {
//         input
//     }
// })
