import '../App.css';
import './stickerLayout.css'
import './printPreview.css';
import LabelPreview from './LabelPreview';

export function PrintPreview({ label }) {
    if (label == null) {
        label = {
            name: 'Chicken Parmigiana',
            amount: 16,
            ingredients: 'Pork Sausage, Marinara Sauce (plum tomatoes, onions, garlic, parsley, basil), romano cheese (milk, salt, starch, enzymes) parmigiana cheese',
            dateMark: '',
            expiration: '12-2-2222',
            options: [true, true, true],
            printOption: true,
            numPages: -1
        };
    }

    return (
        <div className="printerPageSize">
            <div className="labelGrid">
                {Array.from({length: 15}).map((_, index) => (
                    <span style={{ border: 'none' }}>
                        <LabelPreview key={index} label={label} border={false}/>
                    </span>
                ))}
            </div>
        </div>
    );
}