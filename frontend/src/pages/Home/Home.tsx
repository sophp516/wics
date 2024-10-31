import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.tsx";
import "./Home.css";

interface SearchQuery {
    input: string;
    distribs: string[];
    worldCulture: string[];
}

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<SearchQuery>({
        input: '',
        distribs: [],
        worldCulture: [],
    }); 
    const [distribToggle, setDistribToggle] = useState<boolean>(false);
    const [selectedWorldCulture, setSelectedWorldCulture] = useState<string[]>([]);
    const [selectedDistrib, setSelectedDistrib] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');

    const Distrib = [
        'art', 'lit', 'tmv', 'int', 'soc', 'qds', 'sci', 'sla', 'tas', 'tla'
    ];

    const WorldCulture = [
        'w', 'nw', 'cl'
    ];

    const handleCheckboxChange = (category: string, value: string) => {
        if (category === 'worldCulture') {
            const updatedSelection = selectedWorldCulture.includes(value)
                ? selectedWorldCulture.filter(req => req !== value)
                : [...selectedWorldCulture, value];

            setSelectedWorldCulture(updatedSelection);
            setSearchQuery(prev => ({
                ...prev,
                worldCulture: updatedSelection,
            }));
        } else {
            const updatedSelection = selectedDistrib.includes(value)
                ? selectedDistrib.filter(req => req !== value)
                : [...selectedDistrib, value];

            setSelectedDistrib(updatedSelection);
            setSearchQuery(prev => ({
                ...prev,
                distribs: updatedSelection,
            }));
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        setSearchQuery(prev => ({ ...prev, input: event.target.value }));
    };

    const handleSearchClick = async () => {
        console.log("Searching for:", searchQuery);
        try {
            const response = await fetch(`/api/course/search?textQuery=${searchQuery.input}&distribs=${searchQuery.distribs.join(',')}&worldCulture=${searchQuery.worldCulture.join(',')}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log("Search results:", data);

            navigate(
                '/searchresult', {
                    state: {
                        courseResult: data.courses,
                        profResult: data.professors
                    }
                })

        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          handleSearchClick();
        }
    };

    return (
        <div className="home">
            <Navbar />
            <div className="home-main">
                <p>WiCS</p>
                <div className="search-container">
                    {distribToggle ? (
                        <div>
                            <div>
                                {WorldCulture.map(req => (
                                    <label key={req}>
                                        <input
                                            type="checkbox"
                                            checked={selectedWorldCulture.includes(req)}
                                            onChange={() => handleCheckboxChange('worldCulture', req)}
                                        />
                                        {req.toUpperCase()}
                                    </label>
                                ))}
                            </div>
                            <div>
                                {Distrib.map(req => (
                                    <label key={req}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDistrib.includes(req)}
                                            onChange={() => handleCheckboxChange('distrib', req)}
                                        />
                                        {req.toUpperCase()}
                                    </label>
                                ))}
                            </div>
                            <button onClick={() => setDistribToggle(false)}>save</button>
                        </div>
                    ) : (
                        <div onClick={() => setDistribToggle(true)}>
                            {(selectedDistrib.length === 0 && selectedWorldCulture.length == 0) ?
                            <p>Search by distrib</p>
                            : 
                            <div>
                                {selectedWorldCulture.map((req, i) => 
                                <label key={req}>
                                    <input
                                        type="checkbox"
                                        checked={selectedWorldCulture.includes(req)}
                                        onChange={() => handleCheckboxChange('worldCulture', req)}
                                    />
                                    {req.toUpperCase()}
                                </label>)}
                                {selectedDistrib.map((req, i) => 
                                <label key={req}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDistrib.includes(req)}
                                        onChange={() => handleCheckboxChange('distrib', req)}
                                    />
                                    {req.toUpperCase()}
                                </label>)}
                            </div>}
                        </div>
                    )}
                    <div>
                        <input 
                            type="text"
                            onChange={handleSearchChange} 
                            value={input} 
                            placeholder="Search for a class or professor"
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSearchClick}>Search</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Home;
