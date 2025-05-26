import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
            <p className="mt-4 text-lg">This is the main page of the application.</p>
        </div>
    );
};

export default Home;