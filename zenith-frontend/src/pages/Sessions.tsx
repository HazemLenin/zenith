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
            <div className="flex flex-col sm:flex-row gap-4 w-full bg-danger">
                <Input 
                    type="text"
                    placeholder="Enter session name"
                    value=''
                    onChangeFun={()=>{}}
                />
                <div className='flex '>
                <Input 
                    type="number"
                    placeholder="Enter session points"
                    value=''
                    onChangeFun={()=>{}}
                    />
                <div className='px-4 bg-primary gap-2 flex items-center justify-center'><span>Out of:</span><span>{points}</span></div>
                    </div>
                <Button
                    btnName='Add'
                />
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