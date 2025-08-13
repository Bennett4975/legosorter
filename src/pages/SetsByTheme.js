import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SetsByThemeList from '../components/SetsByThemeList';

const SetsByTheme = () => {
    const { theme_id } = useParams();
    console.log(theme_id);
    return (
        <div>
            <SetsByThemeList theme={theme_id} />
        </div>
    )
};

export default SetsByTheme;