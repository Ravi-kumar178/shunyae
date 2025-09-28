import React from 'react';
import { Oval } from 'react-loader-spinner';
import './Loader.css'

const Loader = () => {
    return (
        <div className={'loaderContainer'}>
            <Oval
                height={80}
                width={80}
                color="#0075ce"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#0075ce"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    );
};

export default Loader;
