import styles from './home.module.scss';
import { GetStaticProps}  from 'next';
import Head from 'next/head';
import Link  from 'next/link';
import { api } from '../services/api';
import {format, parseISO } from 'date-fns';
import ptBR  from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import Image from 'next/image';
import Episode from './episodes/[id]';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

type Episode = {
  id: string;
  title: string;
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string,
  description:string
}
type HomeProps = {
  latest: Episode[];
  all:Episode[]
}

export default function Home({all, latest}:HomeProps) {

  const { play, playList } = useContext(PlayerContext);
  const episodeList = [...latest, ...all];
  return (
    
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
        <h1>Index</h1>
        <section className={styles.latestEpisodes}>
          <h2>Últimos episódios</h2>
          <ul>
            {
              latest.map((e, index) =>{
                return (
                  <li key={e.id}>
                    <Image 
                    width={192} 
                    height={192} 
                    objectFit="cover"
                    src={e.thumbnail} 
                    alt={e.title}/>
                    <div className={styles.episodeDetails}>
                      <Link href={`/episodes/${e.id}`}>
                        <a>{e.title}</a>
                      </Link>
                      <p>{e.members}</p>
                      <span>{e.publishedAt}</span>
                      <span>{e.durationAsString}</span>
                    </div>
                    <button type="button" onClick = {()=> playList(episodeList, index)}>
                      <img src="/play-green.svg" alt="tocar episódio"/>
                    </button>
                  </li>
                )
              })
            }
          </ul>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}> 
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {
                all.map((e, index) => {
                  return(
                    <tr key={e.id}>
                      <td style={{ width: 72}}>
                        <Image 
                          width={120} 
                          height={120}
                          src={e.thumbnail}
                          alt={e.title}
                        />
                      </td>
                      <td>
                        <Link href={`/episodes/${e.id}`}>
                          <a>{e.title}</a>
                        </Link>
                      </td>

                      <td>{e.members}</td>
                      <td style={{width:100}}>{e.publishedAt}</td>
                      <td>{e.durationAsString}</td>
                      <td>
                        <button type="button" onClick = {()=> playList(episodeList, index + latest.length)} >
                          <img src="/play-green.svg" alt="Tocar episódio"/>
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </section>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () =>{
  const response = await api.get('episodes?_limit=12&sort=published_at&order=desc');
  /*
    or
    const {data} = await api.get('http://localhost:3333/episodes?_limit=12&sort=published_at&order=desc',{
      params:{
        _limit: 12,
        _sort:
      }
    });
  */
  const data =  response.data;

  const episodes = data.map(e =>{
    return {
      id:e.id,
      title: e.title,
      thumbnail: e.thumbnail,
      publishedAt: format(parseISO(e.published_at), 'd MMM yy', {locale:ptBR}),
      duration:e.file.duration,
      durationAsString: convertDurationToTimeString(Number(e.file.duration)),
      description: e.description,
      url: e.file.url,
      members: e.members
    }
  });

  const latest = episodes.slice(0,2);
  const all = episodes.slice(2,episodes.length)
  return{
    props:{
      latest,
      all
    },
    revalidate: 60 * 60 * 8
  }
}