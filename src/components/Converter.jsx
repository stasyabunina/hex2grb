import { useState, useEffect } from 'react';

function Converter() {
    const [hexColor, setHexColor] = useState('#ffffff');
    const [rgbColor, setRgbColor] = useState('rgb(255, 255, 255)');
    const [error, setError] = useState(false);
    const [isButtonShown, setIsButtonShown] = useState(false);
    const [buttonText, setButtonText] = useState('Скопировать');

    useEffect(() => {
        document.documentElement.style.setProperty('--color', rgbColor);
        setIsButtonShown(true);
    }, [rgbColor])

    const onValueChange = (e) => {
        const regExp = /[^a-z0-9]/gi;
        const value = e.target.value;
        const valueText = e.target.value.substring(1);

        if (regExp.test(valueText)) {
            setHexColor(`#${valueText.replace(regExp, '')}`);
        } else {
            setHexColor(value);
        }

        isHash(value);

        value.length === 7 ? changeToRGB(value) : setIsButtonShown(false);
    }

    const changeToRGB = (color) => {
        if (isHexColorValid(color) === false) {
            setError(true);
            return;
        }

        setError(false);
        const convertedColor = convertToRGB(color);
        setRgbColor(convertedColor);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (isHexColorValid(hexColor) === false) {
            setError(true);
            return;
        }

        setError(false);
        const convertedColor = convertToRGB(hexColor);
        setRgbColor(convertedColor);
    }

    const convertToRGB = (color) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        return `rgb(${r}, ${g}, ${b})`;
    }

    const isHash = (value) => {
        if (!value.match(/^#/)) {
            setHexColor(`#${value}`);
        }
    }

    const isHexColorValid = (color) => {
        if (!color.startsWith('#') || /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.test(color) === false || color.length !== 7) {
            return false;
        }
    }

    const onClick = () => {
        const prevText = buttonText;
        navigator.clipboard.writeText(rgbColor);
        setButtonText('Скопировано!');

        setTimeout(() => {
            setButtonText(prevText);
        }, 3000)
    }

    return (
        <div className='form-wrapper'>
            <form className='form' onSubmit={onSubmit}>
                <input id='input' type='text' className='input' placeholder='#ffffff' onChange={onValueChange} value={hexColor} maxLength='7' />
                <label className='label' htmlFor='input'>
                    <span className='label-text'>{error ? 'Ошибка!' : rgbColor}</span>
                </label>
            </form>
            {isButtonShown ? <button className='copy-btn' onClick={onClick}>{buttonText}</button> : <></>}
        </div>
    );
}

export default Converter;