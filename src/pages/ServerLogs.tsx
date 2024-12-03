import React, { useEffect, useState } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiUrl } from '../Utills/constantt';
import BasicTable from '../components/BasicTable/BasicTable';
import { FaEye } from 'react-icons/fa'; // Eye icon for viewing JSON

export const ServerLogs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [jsonType, setJsonType] = useState(''); // 'request' or 'response' to track which body to show in modal

    // Define columns with eye icon in requestBody and responseBody columns
    const columns = React.useMemo(
        () => [
            { Header: "Method", accessorKey: "method" },
            { Header: "Path", accessorKey: "path" },
            { Header: "User ID", accessorKey: "userID" },
            {
                Header: "Request Body", 
                accessorKey: "body", 
                cell: (row: any) => (
                    <>
                        
                       <div className='flex justify-center'>
                       <FaEye
                            onClick={() => handleViewJson('request', row.row.original)}
                            style={{ cursor: 'pointer', color: 'blue', fontSize: '20px', marginLeft: '10px' }}
                        />
                       </div>
                    </>
                )
            },
            {
                Header: "Response Body", 
                accessorKey: "responseBody", 
                cell: (row: any) => (
                    <div className='flex justify-center'> 
                        
                        <FaEye
                            onClick={() => handleViewJson('response', row.row.original)}
                            style={{ cursor: 'pointer', color: 'blue', fontSize: '20px', marginLeft: '10px' }}
                        />
                    </div>
                )
            }
        ],
        []
    );

    // Handle modal display for request/response body
    const handleViewJson = (type: string, log: any) => {
        setJsonType(type);
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLog(null);
    };

    // Fetch logs from API
    useEffect(() => {
        async function fetchLogs() {
            try {
                const data = await axios.get(`${apiUrl}/api/logs`);
                setLogs(data.data);
            } catch (error) {
                toast.error("Something went wrong.");
            }
        }
        fetchLogs();
    }, []);

    return (
        <DefaultLayout isList={true}>
            <BasicTable
                data={logs}
                columns={columns}
                actions={""}
                filter={["userID","method"]}
            />

            {/* Modal for showing JSON details */}
            {isModalOpen && selectedLog && (
                <div style={modalStyle.overlay}>
                    <div style={modalStyle.modal}>
                     
                    <button onClick={closeModal} style={modalStyle.closeBtn}>X</button>

                        <pre>
                            {JSON.stringify(
                                jsonType === 'request' ? selectedLog.body : selectedLog.responseBody,
                                null,
                                2
                            )}
                        </pre>

                    </div>

                </div>
            )}
        </DefaultLayout>
    );
};

// Modal styling
const modalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    closeBtn: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default ServerLogs;
