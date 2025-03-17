"use client"
import { Popover, Typography } from '@mui/material'
import React from 'react';
interface HoverPopoverProps {
  outerContent: string
  innerContent: string
}

// export default function HoverPopover(props: HoverPopoverProps) {
//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {

//   }
//   return (
//       <Popover>
//           {children}
//       </Popover>
//   )
// }

export default function HoverPopover(props: HoverPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div style={{display: 'inline-block'}}>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {props.outerContent}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{props.innerContent}</Typography>
      </Popover>
    </div>
  );
}