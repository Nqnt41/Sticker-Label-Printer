import '../App.css';

function LabelPreview({ label, border }) {
    const address = `Joey's Seafood Shack
                            1800 US Highway 1
                            Vero Beach, FL 32960`;
    const number = '772-918-8855';

    return (
        <div className={`labelContainer ${border ? '' : 'borderless'}`}>
            <h2 className='nameContainer'>
                    {label.options[0] ? `Kimmy's ` : ''}
                    {label.name}
                    {label.amount !== 0 ? ` (${label.amount}\u00A0oz)` : ''}
            </h2>
            <h2 className='ingredients'>{label.ingredients}</h2>
            {label.options[1] && (
                <h2 className='display address'>{address}</h2>
            )}
            {label.dateMark !== 'N/A' && (
                <h3 className='dateMark'>{label.dateMark}</h3>
            )}
            {label.options[2] && (
                <h2 className='number'>{number}</h2>
            )}
            {label.expiration !== '' && (
                <h3 className='expiration'>exp. {label.expiration}</h3>
            )}
        </div>
    )
}

export default LabelPreview;