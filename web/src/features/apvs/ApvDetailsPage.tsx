import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {fetchApv} from '../../firebase/ApvQueries';
import {EmployeeApvModel} from '../../firebase/models/EmployeeApvModel';
import {ProjectApvModel} from '../../firebase/models/ProjectApvModel';
import {EmployeeApvDetailsPage} from './EmployeeApvDetailsPage';
import {ProjectApvDetailsPage} from './ProjectApvDetailsPage';

export const ApvDetailsPage = () => {
    const {id = ''} = useParams();
    const [apv, setApv] = useState<EmployeeApvModel | ProjectApvModel | null>(null);

    useEffect(() => {
        fetchApv(id).then((d: EmployeeApvModel | ProjectApvModel | null) => {
            setApv(d);
        })
    }, [id]);

    return apv?.apvType === 'employeeApv' ? <EmployeeApvDetailsPage/> : <ProjectApvDetailsPage/>
}
