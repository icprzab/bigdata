import React, { createContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';

import Chart from './chart';

export const YearContext = createContext();
export const CityContext = createContext();
export const DistrictContext = createContext();
export const LoadingContext = createContext();

function APP() {
    const [year, setYear] = useState('111');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [loading, setLoading] = useState(false);
    const address = `/${year}/${city}/${district}`;
    return (
        <Router>
            <LoadingContext.Provider value={[loading, setLoading]}>
                <DistrictContext.Provider value={[district, setDistrict]}>
                    <CityContext.Provider value={[city, setCity]}>
                        <YearContext.Provider value={[year, setYear]}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path={address} element={<Chart />} />
                            </Routes>
                        </YearContext.Provider>
                    </CityContext.Provider>
                </DistrictContext.Provider>
            </LoadingContext.Provider>
        </Router>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<APP />);
