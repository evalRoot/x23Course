//

import Card from './Card';
import Input from './Input';
import Typography from './Typography';
import CssBaseline from './CssBaseline';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Card(theme),
    Input(theme),
    Typography(theme),
    CssBaseline(theme)
  );
}
