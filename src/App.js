import React, { useState , useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AddPage from './pages/AddPage';
import ArchivePage from './pages/ArchivePage';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { putAccessToken, getUserLogged } from './utils/network-data';
import loading from './img/loading-gif.gif';
import LocaleContext from './context/LocaleContext';
function App() {
  const [authedUser, setAuthedUser] = useState(localStorage.getItem('auth') || null);
  const [initializing, setInitializing] = useState(false);
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'id')

  async function onLoginSuccess({ accessToken }){
    setInitializing(true)
    putAccessToken(accessToken);
    const { data } = await getUserLogged();
    setAuthedUser(() => {
      return data;
    })
    localStorage.setItem('auth', data);
    setInitializing(false)
  }

  const toggleLocale = () => {
    setLocale((prevLocale) => {
      return prevLocale === 'id' ? 'en' : 'id';
    });
    localStorage.setItem('locale', locale);
  }

  const localeContextValue = useMemo(() => {
    return {
      locale,
      toggleLocale
    };
  }, [locale]);

  const onLogout = () => {
    setAuthedUser(() => {
      return null;
    })
    localStorage.removeItem('auth');
  }

  if (initializing) {
    return (
      <img src={loading} alt='loading'/>
    )
  }

  return (
    <LocaleContext.Provider value={localeContextValue}>
      <div className="app-container">
        <header className='note-app__header'>
          <Navigation logout={onLogout} authed={authedUser} /> 
        </header>
        <main>
          {authedUser ?
            <Routes>
              <Route path="/" element={<HomePage authed={authedUser} />} />
              <Route path="/notes/:id" element={<DetailPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path='*' element={<NotFoundPage authed={authedUser} />} />
            </Routes>
            : <Routes>
                <Route path="*" element={<LoginPage authed={authedUser} loginSuccess={onLoginSuccess} />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            }  
        </main>
        <footer>R10. Zaidan Noor Irfan</footer>
      </div>
    </LocaleContext.Provider>
  );
}

export default App;
