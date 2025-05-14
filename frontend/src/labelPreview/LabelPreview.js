import '../App.css';
import '../stickerLayout/stickerLayout.css';
import './labelPreview.css';
import './labelPreviewLandscape.css';

import {useNavigate} from "react-router-dom";

export function LabelPreview({ label, border }) {
    const navigate = useNavigate();

    const address = `Joey's Seafood Shack
                            1800 US Highway 1
                            Vero Beach, FL 32960`;
    const number = '772-918-8855';

    const useNewFormat = JSON.parse(localStorage.getItem('useNewFormat'))

    return (
        <>
            <div
                className={`${useNewFormat ? 'lsLabelContainer' : 'labelContainer'} ${border ? 'border' : 'borderless'}`}
                onClick={() => {
                    if (border) {
                        navigate("/print-preview", {state: {label: label}});
                    }
                }
            }>
                <h2 className='nameContainer'>
                        {label.options[0] ? `Kimmy's ` : `Joey's `}
                        {label.name}
                        {label.size !== 0 ? ` (${label.size}\u00A0oz)` : ''}
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
        </>
    )
}

export default LabelPreview;