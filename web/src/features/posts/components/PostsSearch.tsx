import type { Theme, SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { Iconify } from '../../../components/Iconify';
import { ChangeEvent } from 'react';
import {FetchedPostModel} from '../../../firebase/models/PostModel';

type PostSearchProps = {
    posts: FetchedPostModel[];
    onSearch: (searchText: string) => void;
    sx?: SxProps<Theme>;
};

export function PostSearch({ posts, onSearch, sx }: PostSearchProps) {
    return (
        <Autocomplete
            sx={{ width: 280 }}
            autoHighlight
            popupIcon={null}
            onChange={(_, value) => onSearch(value ? value.title : '')}
            slotProps={{
                paper: {
                    sx: {
                        width: 320,
                        [`& .${autocompleteClasses.option}`]: {
                            typography: 'body2',
                        },
                        ...sx,
                    },
                },
            }}
            options={posts}
            getOptionLabel={(post) => post.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Søg opslag..."
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify
                                        icon="eva:search-fill"
                                        sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                                    />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
            )}
        />
    );
}
