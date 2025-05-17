import React, { useState } from 'react';
import { Button, Input } from '../components';
import Table from '../components/Table/Tablel';

const Sessions: React.FC = () => {
    // Sample test data for the table
    const testData = [
        { id: 1, name: 'Session 1', date: '2024-01-01', points: 100 },
        { id: 2, name: 'Session 2', date: '2024-01-02', points: 150 },
        { id: 3, name: 'Session 3', date: '2024-01-03', points: 200 },
    ];

    const [points, setPoints] = useState<number>(505);

    return (
        <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 w-full ">
                <div className='flex flex-1'>
                    <Input 
                    type="text"
                    placeholder="Session name"
                    value=''
                    onChangeFun={()=>{}}
                />
                </div>
                <div className='flex flex-1 '>
                <Input 
                    type="number"
                    placeholder="Session points"
                    value=''
                    onChangeFun={()=>{}}
                    />
                <div className='px-4 flex items-center justify-center'>
                    <span className='w-20'>Out Of</span>
                    <span className='flex items-center'>
                        {points}
                        <img className="w-8 h-8 ml-1.5" src="/points.png" />
                    </span>

                </div>
                    </div>
                <Button
                >
                    Add
                </Button>
            </div>

            <div className="table-section">
                {/* <Table
                    data={testData}
                    columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Name', accessor: 'name' },
                        { header: 'Date', accessor: 'date' },
                        { header: 'Points', accessor: 'points' }
                    ]}
                /> */}
            </div>
        </div>
    );
};

export default Sessions;