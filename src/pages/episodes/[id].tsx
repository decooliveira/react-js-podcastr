import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image  from 'next/image';
import Head from 'next/head';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import  styles  from './episode.module.scss';
import Link from 'next/link';
import { usePlayer } from '../../context/PlayerContext';


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

type EpisodeProps = {
    episode:Episode
}

export default function Episode({episode}:EpisodeProps){

    const { play } = usePlayer();
       return(
        <div className={ styles.episode}>

     <Head>
        <title>Podcastr | {episode.title}</title>
      </Head>
      
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="voltar"/>
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover"/>
                <button type="button">
                    <img src="/play.svg" onClick= {() => play(episode)} alt="Tocar episódio" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} 
                dangerouslySetInnerHTML= {{__html:episode.description}}/>
                
            
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}
export const getStaticProps: GetStaticProps  = async (context) => {
    const { id } = context.params; //use 'context'instead of useRouter when in GetStaticProps method
    const { data } = await api.get(`/episodes/${id}`)

    const episode = {
        id:data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale:ptBR}),
        duration:data.file.duration,
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        members: data.members
    }
    return {
        props: {
            episode
        }, 
        revalidate: 60 * 60 * 24, //24 hours
    }
}
